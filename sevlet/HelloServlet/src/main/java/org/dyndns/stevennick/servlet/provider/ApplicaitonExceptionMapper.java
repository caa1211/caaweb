package org.dyndns.stevennick.servlet.provider;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

import org.dyndns.stevennick.servlet.model.ServerResponse;

@Provider
public class ApplicaitonExceptionMapper implements ExceptionMapper<Throwable> {

	@Override
	public Response toResponse(Throwable exception) {
		// TODO Use mapper to handle and customized application exceptions.
		if (exception.getLocalizedMessage() == null || exception.getLocalizedMessage().isEmpty()) {
			Response response = Response.serverError().build();
			ServerResponse errorResponse = new ServerResponse(-1, "Something wrong!");
			return Response.fromResponse(response).status(Status.INTERNAL_SERVER_ERROR).entity(errorResponse).type(MediaType.APPLICATION_JSON).build();
		} else {
			Response response = Response.serverError().build();
			return Response.fromResponse(response).status(Status.INTERNAL_SERVER_ERROR).entity(new ServerResponse(Status.INTERNAL_SERVER_ERROR.getStatusCode(), exception.getLocalizedMessage())).type(MediaType.APPLICATION_JSON).build();
		}
	}

}
