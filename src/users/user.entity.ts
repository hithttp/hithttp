import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { IsString, IsEmail, IsUUID, Length, IsOptional, IsPhoneNumber, IsEnum, IsMobilePhone } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Resource } from '../resource/resource.entity';
import { Api } from '../api/api.entity';

@Entity()
export class User {
    @IsOptional()
    @PrimaryGeneratedColumn('uuid')
    id: string;


    @IsOptional()
    @Column({ length: "255" ,nullable: true})
    @IsString()
    token: string;

    @IsOptional()
    @Column({ length: "8" ,nullable: true})
    @IsString()
    uniqkey: string;

    @ApiProperty()
    @Column({ unique: true })
    @IsEmail()
    email: string;

    @ApiProperty()
    @Column()
    @IsString()
    fullname: string;
   
    @ApiProperty()
    @Column({length:6,nullable: true})
    @IsString()
    otp: string;

    @ApiProperty()
    @Column({type:"timestamp",nullable: true})
    @IsString()
    otpcreatedon: string;

    @ApiProperty()
    @Column({ length: "255" })
    @IsString()
    @Length(8, 15)
    password: string;

    @OneToMany(type => Resource, resource => resource.user,{ eager: true })
    resources: Resource[];

    @OneToMany(type => Api, api => api.user,{ eager: true })
    apis: Api[];

}