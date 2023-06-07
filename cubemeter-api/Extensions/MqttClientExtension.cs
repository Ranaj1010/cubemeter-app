using MQTTnet;
using MQTTnet.Client;
using System.Security.Authentication;
using MQTTnet.Extensions.WebSocket4Net;
using MQTTnet.Formatter;
using cubemeter_api.Extensions;
using MQTTnet.Packets;
using MQTTnet.Protocol;

namespace cubemeter_api.Extensions
{
    public static class MqttClientExtension
    {
        public static async Task CleanDisconnect(IMqttClient mqttClient)
        {
            /*
             * This sample disconnects in a clean way. This will send a MQTT DISCONNECT packet
             * to the server and close the connection afterwards.
             *
             * See sample _Connect_Client_ for more details.
             */
            // This will send the DISCONNECT packet. Calling _Dispose_ without DisconnectAsync the 
            // connection is closed in a "not clean" way. See MQTT specification for more details.
            await mqttClient.DisconnectAsync(new MqttClientDisconnectOptionsBuilder().WithReason(MqttClientDisconnectOptionsReason.NormalDisconnection).Build());

        }

        public static async Task<IMqttClient> ConnectClient(string host)
        {
            /*
             * This sample creates a simple MQTT client and connects to a public broker.
             *
             * Always dispose the client when it is no longer used.
             * The default version of MQTT is 3.1.1.
             */

            IMqttClient result;

            var mqttFactory = new MqttFactory();

            using (var mqttClient = mqttFactory.CreateMqttClient())
            {

                // Use builder classes where possible in this project.
                var mqttClientOptions = new MqttClientOptionsBuilder().WithTcpServer(host).Build();

                // This will throw an exception if the server is not available.
                // The result from this message returns additional data which was sent 
                // from the server. Please refer to the MQTT protocol specification for details.
                var response = await mqttClient.ConnectAsync(mqttClientOptions, CancellationToken.None);

                Console.WriteLine("The MQTT client is connected.");

                response.DumpToConsole();

                result = mqttClient;
            }

            return result;

        }

        public static async Task Connect_With_Amazon_AWS()
        {
            /*
             * This sample creates a simple MQTT client and connects to an Amazon Web Services broker.
             *
             * The broker requires special settings which are set here.
             */

            var mqttFactory = new MqttFactory();

            using (var mqttClient = mqttFactory.CreateMqttClient())
            {
                var mqttClientOptions = new MqttClientOptionsBuilder()
                    .WithTcpServer("amazon.web.services.broker")
                    // Disabling packet fragmentation is very important!  
                    .WithoutPacketFragmentation()
                    .Build();

                await mqttClient.ConnectAsync(mqttClientOptions, CancellationToken.None);

                Console.WriteLine("The MQTT client is connected.");

                await mqttClient.DisconnectAsync();
            }
        }

        public static async Task Connect_Client_Timeout()
        {
            /*
             * This sample creates a simple MQTT client and connects to an invalid broker using a timeout.
             * 
             * This is a modified version of the sample _Connect_Client_! See other sample for more details.
             */

            var mqttFactory = new MqttFactory();

            using (var mqttClient = mqttFactory.CreateMqttClient())
            {
                var mqttClientOptions = new MqttClientOptionsBuilder().WithTcpServer("127.0.0.1").Build();

                try
                {
                    using (var timeoutToken = new CancellationTokenSource(TimeSpan.FromSeconds(1)))
                    {
                        await mqttClient.ConnectAsync(mqttClientOptions, timeoutToken.Token);
                    }
                }
                catch (OperationCanceledException)
                {
                    Console.WriteLine("Timeout while connecting.");
                }
            }
        }

        public static async Task Connect_Client_Using_MQTTv5()
        {
            /*
             * This sample creates a simple MQTT client and connects to a public broker using MQTTv5.
             * 
             * This is a modified version of the sample _Connect_Client_! See other sample for more details.
             */

            var mqttFactory = new MqttFactory();

            using (var mqttClient = mqttFactory.CreateMqttClient())
            {
                var mqttClientOptions = new MqttClientOptionsBuilder().WithTcpServer("broker.hivemq.com").WithProtocolVersion(MqttProtocolVersion.V500).Build();

                // In MQTTv5 the response contains much more information.
                var response = await mqttClient.ConnectAsync(mqttClientOptions, CancellationToken.None);

                Console.WriteLine("The MQTT client is connected.");

                response.DumpToConsole();
            }
        }

        public static async Task Connect_Client_Using_TLS_1_2()
        {
            /*
             * This sample creates a simple MQTT client and connects to a public broker using TLS 1.2 encryption.
             * 
             * This is a modified version of the sample _Connect_Client_! See other sample for more details.
             */

            var mqttFactory = new MqttFactory();

            using (var mqttClient = mqttFactory.CreateMqttClient())
            {
                var mqttClientOptions = new MqttClientOptionsBuilder().WithTcpServer("mqtt.fluux.io")
                    .WithTls(
                        o =>
                        {
                            // The used public broker sometimes has invalid certificates. This sample accepts all
                            // certificates. This should not be used in live environments.
                            o.CertificateValidationHandler = _ => true;

                            // The default value is determined by the OS. Set manually to force version.
                            o.SslProtocol = SslProtocols.Tls12;
                        })
                    .Build();

                using (var timeout = new CancellationTokenSource(5000))
                {
                    await mqttClient.ConnectAsync(mqttClientOptions, timeout.Token);

                    Console.WriteLine("The MQTT client is connected.");
                }
            }
        }

        public static async Task Connect_Client_Using_WebSocket4Net()
        {
            /*
             * This sample creates a simple MQTT client and connects to a public broker using a WebSocket connection.
             * Instead of the .NET implementation of WebSockets the implementation from WebSocket4Net is used. It provides more
             * encryption algorithms and supports more platforms.
             * 
             * This is a modified version of the sample _Connect_Client_! See other sample for more details.
             */

            var mqttFactory = new MqttFactory().UseWebSocket4Net();

            using (var mqttClient = mqttFactory.CreateMqttClient())
            {
                var mqttClientOptions = new MqttClientOptionsBuilder().WithWebSocketServer("broker.hivemq.com:8000/mqtt").Build();

                var response = await mqttClient.ConnectAsync(mqttClientOptions, CancellationToken.None);

                Console.WriteLine("The MQTT client is connected.");

                response.DumpToConsole();
            }
        }

        public static async Task Connect_Client_Using_WebSockets()
        {
            /*
             * This sample creates a simple MQTT client and connects to a public broker using a WebSocket connection.
             * 
             * This is a modified version of the sample _Connect_Client_! See other sample for more details.
             */

            var mqttFactory = new MqttFactory();

            using (var mqttClient = mqttFactory.CreateMqttClient())
            {
                var mqttClientOptions = new MqttClientOptionsBuilder().WithWebSocketServer("broker.hivemq.com:8000/mqtt").Build();

                var response = await mqttClient.ConnectAsync(mqttClientOptions, CancellationToken.None);

                Console.WriteLine("The MQTT client is connected.");

                response.DumpToConsole();
            }
        }

        public static async Task Connect_Client_With_TLS_Encryption()
        {
            /*
             * This sample creates a simple MQTT client and connects to a public broker with enabled TLS encryption.
             * 
             * This is a modified version of the sample _Connect_Client_! See other sample for more details.
             */

            var mqttFactory = new MqttFactory();

            using (var mqttClient = mqttFactory.CreateMqttClient())
            {
                var mqttClientOptions = new MqttClientOptionsBuilder().WithTcpServer("test.mosquitto.org", 8883)
                    .WithTls(
                        o =>
                        {
                            // The used public broker sometimes has invalid certificates. This sample accepts all
                            // certificates. This should not be used in live environments.
                            o.CertificateValidationHandler = _ => true;
                        })
                    .Build();

                // In MQTTv5 the response contains much more information.
                using (var timeout = new CancellationTokenSource(5000))
                {
                    var response = await mqttClient.ConnectAsync(mqttClientOptions, timeout.Token);

                    Console.WriteLine("The MQTT client is connected.");

                    response.DumpToConsole();
                }
            }
        }

        public static async Task DisconnectClean()
        {
            /*
             * This sample disconnects from the server with sending a DISCONNECT packet.
             * This way of disconnecting is treated as a clean disconnect which will not
             * trigger sending the last will etc.
             */

            var mqttFactory = new MqttFactory();

            using (var mqttClient = mqttFactory.CreateMqttClient())
            {
                var mqttClientOptions = new MqttClientOptionsBuilder().WithTcpServer("broker.hivemq.com").Build();

                await mqttClient.ConnectAsync(mqttClientOptions, CancellationToken.None);

                // Calling _DisconnectAsync_ will send a DISCONNECT packet before closing the connection.
                // Using a reason code requires MQTT version 5.0.0!
                await mqttClient.DisconnectAsync(MqttClientDisconnectOptionsReason.ImplementationSpecificError);
            }
        }

        public static async Task Disconnect_Non_Clean()
        {
            /*
             * This sample disconnects from the server without sending a DISCONNECT packet.
             * This way of disconnecting is treated as a non clean disconnect which will
             * trigger sending the last will etc.
             */

            var mqttFactory = new MqttFactory();

            var mqttClient = mqttFactory.CreateMqttClient();

            var mqttClientOptions = new MqttClientOptionsBuilder().WithTcpServer("broker.hivemq.com").Build();

            await mqttClient.ConnectAsync(mqttClientOptions, CancellationToken.None);

            // Calling _Dispose_ or use of a _using_ statement will close the transport connection
            // without sending a DISCONNECT packet to the server.
            mqttClient.Dispose();
        }

        public static async Task Inspect_Certificate_Validation_Errors()
        {
            /*
             * This sample prints the certificate information while connection. This data can be used to decide whether a connection is secure or not
             * including the reason for that status.
             */

            var mqttFactory = new MqttFactory();

            using (var mqttClient = mqttFactory.CreateMqttClient())
            {
                var mqttClientOptions = new MqttClientOptionsBuilder().WithTcpServer("mqtt.fluux.io", 8883)
                    .WithTls(
                        o =>
                        {
                            o.CertificateValidationHandler = eventArgs =>
                            {
                                eventArgs.Certificate.Subject.DumpToConsole();
                                eventArgs.Certificate.GetExpirationDateString().DumpToConsole();
                                eventArgs.Chain.ChainPolicy.RevocationMode.DumpToConsole();
                                eventArgs.Chain.ChainStatus.DumpToConsole();
                                eventArgs.SslPolicyErrors.DumpToConsole();
                                return true;
                            };
                        })
                    .Build();

                // In MQTTv5 the response contains much more information.
                using (var timeout = new CancellationTokenSource(5000))
                {
                    await mqttClient.ConnectAsync(mqttClientOptions, timeout.Token);
                }
            }
        }

        public static async Task Ping_Server()
        {
            /*
             * This sample sends a PINGREQ packet to the server and waits for a reply.
             *
             * This is only supported in MQTTv5.0.0+.
             */

            var mqttFactory = new MqttFactory();

            using (var mqttClient = mqttFactory.CreateMqttClient())
            {
                var mqttClientOptions = new MqttClientOptionsBuilder().WithTcpServer("broker.hivemq.com").Build();

                await mqttClient.ConnectAsync(mqttClientOptions, CancellationToken.None);

                // This will throw an exception if the server does not reply.
                await mqttClient.PingAsync(CancellationToken.None);

                Console.WriteLine("The MQTT server replied to the ping request.");
            }
        }

        public static async Task Reconnect_Using_Event()
        {
            /*
             * This sample shows how to reconnect when the connection was dropped.
             * This approach uses one of the events from the client.
             * This approach has a risk of dead locks! Consider using the timer approach (see sample).
             */

            var mqttFactory = new MqttFactory();

            using (var mqttClient = mqttFactory.CreateMqttClient())
            {
                var mqttClientOptions = new MqttClientOptionsBuilder().WithTcpServer("broker.hivemq.com").Build();

                mqttClient.DisconnectedAsync += async e =>
                {
                    if (e.ClientWasConnected)
                    {
                        // Use the current options as the new options.
                        await mqttClient.ConnectAsync(mqttClient.Options);
                    }
                };

                await mqttClient.ConnectAsync(mqttClientOptions, CancellationToken.None);
            }
        }

        public static void Reconnect_Using_Timer()
        {
            /*
             * This sample shows how to reconnect when the connection was dropped.
             * This approach uses a custom Task/Thread which will monitor the connection status.
             * This is the recommended way but requires more custom code!
             */

            var mqttFactory = new MqttFactory();

            using (var mqttClient = mqttFactory.CreateMqttClient())
            {
                var mqttClientOptions = new MqttClientOptionsBuilder().WithTcpServer("broker.hivemq.com").Build();

                _ = Task.Run(
                    async () =>
                    {
                        // User proper cancellation and no while(true).
                        while (true)
                        {
                            try
                            {
                                // This code will also do the very first connect! So no call to _ConnectAsync_ is required in the first place.
                                if (!await mqttClient.TryPingAsync())
                                {
                                    await mqttClient.ConnectAsync(mqttClientOptions, CancellationToken.None);

                                    // Subscribe to topics when session is clean etc.
                                    Console.WriteLine("The MQTT client is connected.");
                                }
                            }
                            catch
                            {
                                // Handle the exception properly (logging etc.).
                            }
                            finally
                            {
                                // Check the connection state every 5 seconds and perform a reconnect if required.
                                await Task.Delay(TimeSpan.FromSeconds(5));
                            }
                        }
                    });
            }
        }
        public static async Task Publish_Application_Message()
        {
            /*
             * This sample pushes a simple application message including a topic and a payload.
             *
             * Always use builders where they exist. Builders (in this project) are designed to be
             * backward compatible. Creating an _MqttApplicationMessage_ via its constructor is also
             * supported but the class might change often in future releases where the builder does not
             * or at least provides backward compatibility where possible.
             */

            var mqttFactory = new MqttFactory();

            using (var mqttClient = mqttFactory.CreateMqttClient())
            {
                var mqttClientOptions = new MqttClientOptionsBuilder()
                    .WithTcpServer("broker.hivemq.com")
                    .Build();

                await mqttClient.ConnectAsync(mqttClientOptions, CancellationToken.None);

                var applicationMessage = new MqttApplicationMessageBuilder()
                    .WithTopic("samples/temperature/living_room")
                    .WithPayload("19.5")
                    .Build();

                await mqttClient.PublishAsync(applicationMessage, CancellationToken.None);

                await mqttClient.DisconnectAsync();

                Console.WriteLine("MQTT application message is published.");
            }
        }

        public static async Task Publish_Multiple_Application_Messages()
        {
            /*
             * This sample pushes multiple simple application message including a topic and a payload.
             *
             * See sample _Publish_Application_Message_ for more details.
             */

            var mqttFactory = new MqttFactory();

            using (var mqttClient = mqttFactory.CreateMqttClient())
            {
                var mqttClientOptions = new MqttClientOptionsBuilder()
                    .WithTcpServer("broker.hivemq.com")
                    .Build();

                await mqttClient.ConnectAsync(mqttClientOptions, CancellationToken.None);

                var applicationMessage = new MqttApplicationMessageBuilder()
                    .WithTopic("samples/temperature/living_room")
                    .WithPayload("19.5")
                    .Build();

                await mqttClient.PublishAsync(applicationMessage, CancellationToken.None);

                applicationMessage = new MqttApplicationMessageBuilder()
                    .WithTopic("samples/temperature/living_room")
                    .WithPayload("20.0")
                    .Build();

                await mqttClient.PublishAsync(applicationMessage, CancellationToken.None);

                applicationMessage = new MqttApplicationMessageBuilder()
                    .WithTopic("samples/temperature/living_room")
                    .WithPayload("21.0")
                    .Build();

                await mqttClient.PublishAsync(applicationMessage, CancellationToken.None);

                await mqttClient.DisconnectAsync();

                Console.WriteLine("MQTT application message is published.");
            }
        }
        public static async Task Handle_Received_Application_Message()
        {
            /*
             * This sample subscribes to a topic and processes the received message.
             */

            var mqttFactory = new MqttFactory();

            using (var mqttClient = mqttFactory.CreateMqttClient())
            {
                var mqttClientOptions = new MqttClientOptionsBuilder().WithTcpServer("broker.hivemq.com").Build();

                // Setup message handling before connecting so that queued messages
                // are also handled properly. When there is no event handler attached all
                // received messages get lost.
                mqttClient.ApplicationMessageReceivedAsync += e =>
                {
                    Console.WriteLine("Received application message.");
                    e.DumpToConsole();

                    return Task.CompletedTask;
                };

                await mqttClient.ConnectAsync(mqttClientOptions, CancellationToken.None);

                var mqttSubscribeOptions = mqttFactory.CreateSubscribeOptionsBuilder()
                    .WithTopicFilter(
                        f =>
                        {
                            f.WithTopic("mqttnet/samples/topic/2");
                        })
                    .Build();

                List<string> topics = new List<string>(new string[] { "element1", "element2", "element3" });

                foreach (var topic in topics)
                {
                   var response =  await mqttClient.SubscribeAsync(topic);
                }

                await mqttClient.SubscribeAsync(mqttSubscribeOptions, CancellationToken.None);

                Console.WriteLine("MQTT client subscribed to topic.");

                Console.WriteLine("Press enter to exit.");
                Console.ReadLine();
            }
        }

        public static async Task Send_Responses()
        {
            /*
             * This sample subscribes to a topic and sends a response to the broker. This requires at least QoS level 1 to work!
             */

            var mqttFactory = new MqttFactory();

            using (var mqttClient = mqttFactory.CreateMqttClient())
            {
                mqttClient.ApplicationMessageReceivedAsync += delegate (MqttApplicationMessageReceivedEventArgs args)
                {
                    // Do some work with the message...

                    // Now respond to the broker with a reason code other than success.
                    args.ReasonCode = MqttApplicationMessageReceivedReasonCode.ImplementationSpecificError;
                    args.ResponseReasonString = "That did not work!";

                    // User properties require MQTT v5!
                    args.ResponseUserProperties.Add(new MqttUserProperty("My", "Data"));

                    // Now the broker will resend the message again.
                    return Task.CompletedTask;
                };

                var mqttClientOptions = new MqttClientOptionsBuilder().WithTcpServer("broker.hivemq.com").Build();

                await mqttClient.ConnectAsync(mqttClientOptions, CancellationToken.None);

                var mqttSubscribeOptions = mqttFactory.CreateSubscribeOptionsBuilder()
                    .WithTopicFilter(
                        f =>
                        {
                            f.WithTopic("mqttnet/samples/topic/1");
                        })
                    .Build();

                var response = await mqttClient.SubscribeAsync(mqttSubscribeOptions, CancellationToken.None);

                Console.WriteLine("MQTT client subscribed to topic.");

                // The response contains additional data sent by the server after subscribing.
                response.DumpToConsole();
            }
        }

        public static async Task Subscribe_Multiple_Topics()
        {
            /*
             * This sample subscribes to several topics in a single request.
             */

            var mqttFactory = new MqttFactory();

            using (var mqttClient = mqttFactory.CreateMqttClient())
            {
                var mqttClientOptions = new MqttClientOptionsBuilder().WithTcpServer("broker.hivemq.com").Build();

                await mqttClient.ConnectAsync(mqttClientOptions, CancellationToken.None);

                // Create the subscribe options including several topics with different options.
                // It is also possible to all of these topics using a dedicated call of _SubscribeAsync_ per topic.
                var mqttSubscribeOptions = mqttFactory.CreateSubscribeOptionsBuilder()
                    .WithTopicFilter(
                        f =>
                        {
                            f.WithTopic("mqttnet/samples/topic/1");
                        })
                    .WithTopicFilter(
                        f =>
                        {
                            f.WithTopic("mqttnet/samples/topic/2").WithNoLocal();
                        })
                    .WithTopicFilter(
                        f =>
                        {
                            f.WithTopic("mqttnet/samples/topic/3").WithRetainHandling(MqttRetainHandling.SendAtSubscribe);
                        })
                    .Build();

                var response = await mqttClient.SubscribeAsync(mqttSubscribeOptions, CancellationToken.None);

                Console.WriteLine("MQTT client subscribed to topics.");

                // The response contains additional data sent by the server after subscribing.
                response.DumpToConsole();
            }
        }

        public static async Task SubscribeTopic(IMqttClient mq)
        {
            /*
             * This sample subscribes to a topic.
             */

            var mqttFactory = new MqttFactory();

            using (var mqttClient = mqttFactory.CreateMqttClient())
            {
                var mqttClientOptions = new MqttClientOptionsBuilder().WithTcpServer("broker.hivemq.com").Build();

                await mqttClient.ConnectAsync(mqttClientOptions, CancellationToken.None);

                var mqttSubscribeOptions = mqttFactory.CreateSubscribeOptionsBuilder()
                    .WithTopicFilter(
                        f =>
                        {
                            f.WithTopic("mqttnet/samples/topic/1");
                        })
                    .Build();

                var response = await mqttClient.SubscribeAsync(mqttSubscribeOptions, CancellationToken.None);

                Console.WriteLine("MQTT client subscribed to topic.");

                // The response contains additional data sent by the server after subscribing.
                response.DumpToConsole();
            }
        }
    }
}