import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsString, IsEmail, IsUUID, Length, IsOptional, IsPhoneNumber, IsEnum, IsMobilePhone } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

@Entity()
export class User {
    @IsOptional()
    @PrimaryGeneratedColumn('uuid')
    id: string;


    @IsOptional()
    @Column({ length: "255" ,nullable: true})
    @IsString()
    token: string;

    @ApiModelProperty()
    @Column({ unique: true })
    @IsEmail()
    email: string;

    @ApiModelProperty()
    @Column({ length: "255" })
    @IsString()
    @Length(8, 15)
    password: string;

}