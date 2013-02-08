package org.itri.ccma.vsp.servicelayer.vo;

import java.util.List;

public class VoGroup {
    private String name;
    private Integer id;
    private Integer rid;
    private String description;
    private String location;
    private List<VoResource> resources;



    public List<VoResource> getResources() {
        return resources;
    }

    public void setResources(List<VoResource> resources) {
        this.resources = resources;
    }

    public VoGroup(){}
    
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getRid() {
        return rid;
    }

    public void setRid(Integer rid) {
        this.rid = rid;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }



}
