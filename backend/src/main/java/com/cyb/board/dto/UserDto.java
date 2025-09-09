package com.cyb.board.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class UserDto {
    private int idx;
    private String userType;
    private String id;
    private String name;
    private String phone;
    private String address;
    private String created;
    private String lastUpdated;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String pwd;
}