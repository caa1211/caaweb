package org.dyndns.stevennick.servlet;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.dyndns.stevennick.servlet.model.ResponseBase;
import org.dyndns.stevennick.servlet.model.ServerResponse;
import org.dyndns.stevennick.servlet.model.User;


@Path("/caa")
public class Caa {

    
    public Caa() {

    }

    @Path("/c")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public ResponseBase HelloTheWonderfalWorld() {
        // This will produce generic response for POJO (or POJO-like) object.
       // return new ServerResponse(0, "O2K", new ServerResponse(1, "NO"));
        return new User("aa", "bb");
    }
    
}
