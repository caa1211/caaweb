package org.dyndns.stevennick.servlet;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.dyndns.stevennick.servlet.model.ServerResponse;

@Path("/rest")
public class HelloWorld {

	public HelloWorld() {

	}

	@Path("/world")
	@GET
	@Produces({ MediaType.APPLICATION_JSON })
	public ServerResponse HelloTheWonderfalWorld() {
		// This will produce generic response for POJO (or POJO-like) object.
		return new ServerResponse(0, "OK", new ServerResponse(1, "NO"));
	}

	@Path("/world")
    @POST
    @Produces({ MediaType.APPLICATION_JSON })
    public ServerResponse HelloTheWonderfalWorld_post() {
        // This will produce generic response for POJO (or POJO-like) object.
        return new ServerResponse(0, "OK POST", new ServerResponse(1, "NO"));
    }

	   
	@Path("/dead")
	@GET
	@Produces({ MediaType.APPLICATION_JSON })
	public ServerResponse Oops() throws Exception {
		// This will throw exceptions while request.
		throw new Exception("Oops");
	}

	@Path("/unknownDead")
	@GET
	@Produces({ MediaType.APPLICATION_JSON })
	public ServerResponse OhMyGod() throws Exception {
		// This will throw exceptions while request.
		throw new Exception();
	}
}
