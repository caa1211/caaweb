package org.itri.ccma.vsp.servicelayer.filter;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.FormParam;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MultivaluedMap;

import com.sun.jersey.spi.container.ContainerRequest;
import com.sun.jersey.spi.container.ContainerRequestFilter;

public class AuthenticationFilter implements ContainerRequestFilter {
    
    @Context
    HttpServletRequest httpRequest;

    
	@Override
	public ContainerRequest filter(ContainerRequest request) {
		// TODO Use Request filter handle common operstions for each service request.
	    System.out.println("-filter-");
	    
	    /*
	    MultivaluedMap<String, String> qParams = request.getQueryParameters();
	    // Form fParams = request.getFormParameters();
	    for(String key : qParams.keySet()){
	        String value = qParams.get(key).get(0);
	        qParams.add(key, value);
	    }
	
	    String accessKey = qParams.get("accessKey").get(0);
	    if(accessKey!=null){
	        httpRequest.setAttribute("accessKey", accessKey);
	    }
	    */
		return request;
	}

}
