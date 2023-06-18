using System.Text;
using cubemeter_api.DTOs.RawMeterReading.TopicPayloads;
using cubemeter_api.Entities;
using cubemeter_api.Extensions;
using cubemeter_api.Interfaces;
using MQTTnet;
using MQTTnet.Client;
using MQTTnet.Diagnostics;
using Newtonsoft.Json;

namespace cubemeter_api.Services
{
    public class MqttClientService : IMqttClientService
    {
        private readonly IMeterService _meterService;
        private readonly IRawMeterReadingService _rawMeterReadingService;
        private readonly IMqttClient _mqttClient;
        private readonly MqttFactory _mqttFactory;
        private readonly ILogger<MqttClientService> _logger;
        private List<RawMeterReading> _rawReadings;
        private List<string> _topics;
        private bool _hasNewAddedTopic = false;
        private readonly string _host = "5.189.132.25";
        private PeriodicTimer _timer;

        public MqttClientService(ILogger<MqttClientService> logger, MqttFactory mqttFactory, IMqttClient mqttClient, IMeterService meterService, IRawMeterReadingService rawMeterReadingService)
        {
            _logger = logger;
            _meterService = meterService;
            _rawMeterReadingService = rawMeterReadingService;
            _rawReadings = new List<RawMeterReading>();
            _topics = new List<string>();
            _mqttFactory = mqttFactory;
            _mqttClient = mqttClient;
            _mqttClient.ConnectedAsync += HandleConnectedAsync;
            _mqttClient.DisconnectedAsync += HandleDisconnectedAsync;
            _mqttClient.ApplicationMessageReceivedAsync += HandleApplicationMessageReceivedAsync;
        }
        public async Task StartAsync(CancellationToken cancellationToken)
        {

            var mqttClientOptions = new MqttClientOptionsBuilder().WithTcpServer(_host).Build();

            await _mqttClient.ConnectAsync(mqttClientOptions, CancellationToken.None);

            var meters = await _meterService.ListWithTenantAsync();

            _topics = meters.Select(meter => $"{meter.Tenant.Gateway}/{meter.Tenant.UnitId}").ToList();

            foreach (var topic in _topics)
            {
                await SubscribeToTopic(topic);
            }

            _timer = new PeriodicTimer(TimeSpan.FromSeconds(5));

            _ = Task.Run(async () =>
            {
                while (await _timer.WaitForNextTickAsync())
                {
                    await SaveToDb();
                }
            });

            _ = Task.Run(
           async () =>
           {
               // // User proper cancellation and no while(true).
               while (true)
               {
                   try
                   {
                       // This code will also do the very first connect! So no call to _ConnectAsync_ is required in the first place.
                       if (!await _mqttClient.TryPingAsync())
                       {
                           await _mqttClient.ConnectAsync(_mqttClient.Options, CancellationToken.None);

                           // Subscribe to topics when session is clean etc.
                           _logger.LogInformation("The MQTT client is connected.");
                       }
                   }
                   catch (Exception ex)
                   {
                       // Handle the exception properly (logging etc.).
                       _logger.LogError(ex, "The MQTT client  connection failed");
                   }
                   finally
                   {
                       // Check the connection state every 5 seconds and perform a reconnect if required.
                       await Task.Delay(TimeSpan.FromSeconds(5));
                   }
               }
           });
        }

        public async Task StopAsync(CancellationToken cancellationToken)
        {
            if (cancellationToken.IsCancellationRequested)
            {
                var disconnectOption = new MqttClientDisconnectOptions
                {
                    Reason = (MqttClientDisconnectOptionsReason)MqttClientDisconnectReason.NormalDisconnection,
                    ReasonString = "NormalDisconnection"
                };

                await _mqttClient.DisconnectAsync(disconnectOption, cancellationToken);
            }
            await _mqttClient.DisconnectAsync();
        }


        private void ConfigureMqttClient()
        {
            _mqttClient.ConnectedAsync += HandleConnectedAsync;
            _mqttClient.DisconnectedAsync += HandleDisconnectedAsync;
            _mqttClient.ApplicationMessageReceivedAsync += HandleApplicationMessageReceivedAsync;
        }

        public Task HandleApplicationMessageReceivedAsync(MqttApplicationMessageReceivedEventArgs e)
        {
            string topic = e.ApplicationMessage.Topic;
            string message = System.Text.Encoding.UTF8.GetString(e.ApplicationMessage.PayloadSegment);

            _logger.LogInformation($"TOPIC: {e.ApplicationMessage.Topic} \nMESSAGE: {message}");

            var indexOfSlash = topic.LastIndexOf("/") + 1;
            var topicLength = topic.Length;

            var gateway = topic.Substring(0, indexOfSlash - 1);
            var meter = topic.Substring(indexOfSlash, topicLength - indexOfSlash);

            _logger.LogInformation($"GATEWAY: {gateway}");
            _logger.LogInformation($"METER: {meter}");


            var parsedData = JsonConvert.DeserializeObject<ReadingFromMeterTopicDto>(message);

            _rawReadings.Add(new RawMeterReading
            {
                Gateway = gateway,
                MeterName = topic,
                Topic = topic,
                Voltage = double.Parse(parsedData.Voltage!),
                Kilowatt = double.Parse(parsedData.Kilowatt!),
                Kilowatthour = double.Parse(parsedData.Kilowatthour!),
                Current = double.Parse(parsedData.Current!),
            });

            return Task.CompletedTask;
        }

        public Task HandleConnectedAsync(MqttClientConnectedEventArgs eventArgs)
        {
            _logger.LogInformation($"The MQTT client is connected to {_host}");

            return Task.CompletedTask;
        }

        public async Task HandleDisconnectedAsync(MqttClientDisconnectedEventArgs eventArgs)
        {

            _logger.LogInformation("Disconnected.");

            await Task.CompletedTask;
        }

        public async Task<bool> TestTopicConnection(string topic)
        {
            var success = false;

            var timedout = false;

            var mqttFactory = new MqttFactory();

            using (var mqttClient = mqttFactory.CreateMqttClient())
            {
                bool hasReceivedMessage = false;

                mqttClient.ApplicationMessageReceivedAsync += e =>
                {
                    string message = System.Text.Encoding.UTF8.GetString(e.ApplicationMessage.PayloadSegment);

                    _logger.LogInformation($"TOPIC: {e.ApplicationMessage.Topic} \nMESSAGE: {message}");

                    var parsedData = JsonConvert.DeserializeObject<ReadingFromMeterTopicDto>(message);

                    if (topic == e.ApplicationMessage.Topic)
                    {
                        _logger.LogInformation($"Voltage: {parsedData.Voltage}");
                        _logger.LogInformation($"Kilowatt: {parsedData.Kilowatt}");
                        _logger.LogInformation($"Kilowatthour: {parsedData.Kilowatthour}");
                        _logger.LogInformation($"Current: {parsedData.Current}");

                        success = true;
                        hasReceivedMessage = true;
                    }

                    return Task.CompletedTask;
                };

                // Use builder classes where possible in this project.
                var mqttClientOptions = new MqttClientOptionsBuilder().WithTcpServer(_host).Build();

                // This will throw an exception if the server is not available.
                // The result from this message returns additional data which was sent 
                // from the server. Please refer to the MQTT protocol specification for details.
                var response = await mqttClient.ConnectAsync(mqttClientOptions, CancellationToken.None);

                _logger.LogInformation("The MQTT client is connected.");

                response.DumpToConsole();

                var mqttSubscribeOptions = mqttFactory.CreateSubscribeOptionsBuilder()
                .WithTopicFilter(
                    f =>
                    {
                        f.WithTopic(topic);
                    })
                .Build();

                _logger.LogInformation($"The MQTT client is now subscribed to topic: {topic}.");

                await mqttClient.SubscribeAsync(mqttSubscribeOptions, CancellationToken.None);

                System.Threading.Timer? timer = null;
                timer = new System.Threading.Timer((obj) =>
                                {
                                    timedout = true;
                                    success = false;
                                    timer!.Dispose();
                                },
                            null, 10000, System.Threading.Timeout.Infinite);
                while (!hasReceivedMessage)
                {
                    if (hasReceivedMessage)
                    {
                        return success;
                    }

                    if (timedout)
                    {
                        return success;
                    }
                }

                // Send a clean disconnect to the server by calling _DisconnectAsync_. Without this the TCP connection
                // gets dropped and the server will handle this as a non clean disconnect (see MQTT spec for details).
                var mqttClientDisconnectOptions = mqttFactory.CreateClientDisconnectOptionsBuilder().Build();

                await mqttClient.DisconnectAsync(mqttClientDisconnectOptions, CancellationToken.None);
            }

            return success;
        }

        public async Task<bool> SubscribeToTopic(string topic)
        {
            var mqttSubscribeOptions = _mqttFactory.CreateSubscribeOptionsBuilder()
                .WithTopicFilter(
                    f =>
                    {
                        f.WithTopic(topic);
                    })
                .Build();

            if (_mqttClient!.IsConnected)
            {
                await _mqttClient!.SubscribeAsync(mqttSubscribeOptions);

                _logger.LogInformation($"The MQTT client is now subscribed to topic: {topic}.");
            }

            return true;
        }

        public async Task SaveToDb()
        {
            if (_rawReadings.Count() == 0)
            {
                _logger.LogInformation($"No readings found.");
            }
            if (_rawReadings.Count() > 0)
            {
                _logger.LogInformation($"Reading Count: {_rawReadings.Count()}");

                var savedData = await _rawMeterReadingService.AddRangeAsync(_rawReadings);

                if (savedData.Count > 0)
                {
                    _logger.LogInformation($"Saved data Count: {savedData.Count()}");
                }

                _rawReadings.Clear();
            }


        }
    }
}