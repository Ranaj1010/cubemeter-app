namespace cubemeter_api.Base
{
    public abstract class BaseEntity
    {
        public long Id { get; set; }
        public bool Active { get; set; } = true;
    }
}