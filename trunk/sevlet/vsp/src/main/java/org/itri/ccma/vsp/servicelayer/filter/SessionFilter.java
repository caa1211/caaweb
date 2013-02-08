package org.itri.ccma.vsp.servicelayer.filter;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.FormParam;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MultivaluedMap;

import com.sun.jersey.spi.container.ContainerRequest;
import com.sun.jersey.spi.container.ContainerRequestFilter;

public class SessionFilter implements ContainerRequestFilter {
    
    @Context
    HttpServletRequest httpRequest;
    
	@Override
	public ContainerRequest filter(ContainerRequest request) {
	    System.out.println("-Session filter-");
	    //get user from user Filter
	    //Session session = new Session();
		return request;
	}

}
