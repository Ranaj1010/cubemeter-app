using MQTTnet.Client;

namespace cubemeter_api.Interfaces
{
    public interface IMqttClientService : IHostedService
    {
        Task<bool> TestTopicConnection(string topic);
        Task<bool> SubscribeToTopic(string topic);
    }
}