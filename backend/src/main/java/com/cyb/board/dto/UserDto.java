package com.cyb.board.dto;

import lombok.Data;

@Data
public class UserDto {
    private int idx;
    private String userType;
    private String id;
    private String pwd;
    private String name;
    private String phone;
    private String address;
    private String created;
    private String lastUpdated;
}