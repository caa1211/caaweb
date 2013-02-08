package org.dyndns.stevennick.servlet.filter;

import com.sun.jersey.spi.container.ContainerRequest;
import com.sun.jersey.spi.container.ContainerRequestFilter;

public class AuthenticationFilter implements ContainerRequestFilter {

	@Override
	public ContainerRequest filter(ContainerRequest request) {
		// TODO Use Request filter handle common operstions for each service request.
	    System.out.println("-filter-");
	    //request.setMethod("POST");
		return request;
	}

}
