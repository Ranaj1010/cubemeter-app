﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using NetTopologySuite.Geometries;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using cubemeter_api.Data;

#nullable disable

namespace cubemeter_api.Migrations
{
    [DbContext(typeof(DataContext))]
    [Migration("20230618215800_MeterReadingBatchImplemented")]
    partial class MeterReadingBatchImplemented
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.HasPostgresExtension(modelBuilder, "postgis");
            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("cubemeter_api.Entities.Meter", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<bool>("Active")
                        .HasColumnType("boolean");

                    b.Property<DateTime>("ArchivedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("MeterType")
                        .HasColumnType("integer");

                    b.Property<int>("MeterUploadType")
                        .HasColumnType("integer");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Ratio")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Remarks")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("SerialNumber")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("SortNumber")
                        .HasColumnType("integer");

                    b.Property<long>("TenantId")
                        .HasColumnType("bigint");

                    b.HasKey("Id");

                    b.HasIndex("TenantId");

                    b.ToTable("Meters");
                });

            modelBuilder.Entity("cubemeter_api.Entities.MeterReading", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<bool>("Active")
                        .HasColumnType("boolean");

                    b.Property<DateTime>("ArchivedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<double>("CurrentConsumption")
                        .HasColumnType("double precision");

                    b.Property<double>("CurrentReading")
                        .HasColumnType("double precision");

                    b.Property<long>("MeterId")
                        .HasColumnType("bigint");

                    b.Property<long>("MeterReadingBatchId")
                        .HasColumnType("bigint");

                    b.Property<double>("Multi")
                        .HasColumnType("double precision");

                    b.Property<double>("PercentageDifference")
                        .HasColumnType("double precision");

                    b.Property<double>("PreviousConsumption")
                        .HasColumnType("double precision");

                    b.Property<double>("PreviousReading")
                        .HasColumnType("double precision");

                    b.Property<long>("TenantId")
                        .HasColumnType("bigint");

                    b.HasKey("Id");

                    b.ToTable("MeterReadings");
                });

            modelBuilder.Entity("cubemeter_api.Entities.MeterReadingBatch", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<bool>("Active")
                        .HasColumnType("boolean");

                    b.Property<DateTime>("ArchivedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("Id");

                    b.ToTable("MeterReadingBatches");
                });

            modelBuilder.Entity("cubemeter_api.Entities.Place", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<bool>("Active")
                        .HasColumnType("boolean");

                    b.Property<string>("Address")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("ArchivedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("BillingDay")
                        .HasColumnType("integer");

                    b.Property<string>("City")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Country")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Currency")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Point>("MapCoordinates")
                        .IsRequired()
                        .HasColumnType("geometry (point)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Region")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("SerialNumber")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("SortNumber")
                        .HasColumnType("integer");

                    b.Property<string>("Timezone")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Places");
                });

            modelBuilder.Entity("cubemeter_api.Entities.RawMeterReading", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<bool>("Active")
                        .HasColumnType("boolean");

                    b.Property<DateTime>("ArchivedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<double>("Current")
                        .HasColumnType("double precision");

                    b.Property<string>("Gateway")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<double>("Kilowatt")
                        .HasColumnType("double precision");

                    b.Property<double>("Kilowatthour")
                        .HasColumnType("double precision");

                    b.Property<string>("MeterName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Topic")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<double>("Voltage")
                        .HasColumnType("double precision");

                    b.HasKey("Id");

                    b.ToTable("RawMeterReadings");
                });

            modelBuilder.Entity("cubemeter_api.Entities.Tenant", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<bool>("Active")
                        .HasColumnType("boolean");

                    b.Property<DateTime>("ArchivedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("BuildingNumber")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("DateRegistered")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Gateway")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<long>("PlaceId")
                        .HasColumnType("bigint");

                    b.Property<string>("Remarks")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("SerialNumber")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("UnitId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("PlaceId");

                    b.ToTable("Tenants");
                });

            modelBuilder.Entity("cubemeter_api.Entities.Meter", b =>
                {
                    b.HasOne("cubemeter_api.Entities.Tenant", "Tenant")
                        .WithMany("Meters")
                        .HasForeignKey("TenantId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Tenant");
                });

            modelBuilder.Entity("cubemeter_api.Entities.Tenant", b =>
                {
                    b.HasOne("cubemeter_api.Entities.Place", "Place")
                        .WithMany("Tenants")
                        .HasForeignKey("PlaceId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Place");
                });

            modelBuilder.Entity("cubemeter_api.Entities.Place", b =>
                {
                    b.Navigation("Tenants");
                });

            modelBuilder.Entity("cubemeter_api.Entities.Tenant", b =>
                {
                    b.Navigation("Meters");
                });
#pragma warning restore 612, 618
        }
    }
}
