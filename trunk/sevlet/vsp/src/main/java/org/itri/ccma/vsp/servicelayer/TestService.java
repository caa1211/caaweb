package org.itri.ccma.vsp.servicelayer;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.itri.ccma.vsp.servicelayer.response.ServerResponse;
import org.itri.ccma.vsp.servicelayer.response.StatusCode;
import org.itri.ccma.vsp.servicelayer.vo.VoUser;


@Path("/t")
public class TestService {
    

    @Path("/dead")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public ServerResponse dead() throws Exception {
        // This will throw exceptions while request.
        throw new Exception("Oops");
    }
    
    @Path("/unknownDead")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public ServerResponse unknownDead() throws Exception {
        // This will throw exceptions while request.
        throw new Exception();
    }
    
    // **************************************************************************
    // @author Jose
    // resource: /application
    // type: get, post, delete, put
    // **************************************************************************
    @Path("/restCRUD")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public ServerResponse test_get(@QueryParam("name") String name, @Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception {
        // This will throw exceptions while request.
        System.out.print(name);
        return new ServerResponse(StatusCode.Success, "name " + name);
        
    }
    @Path("/restCRUD")
    @POST
    @Produces({ MediaType.APPLICATION_JSON })
    public ServerResponse test_post(@FormParam("name") String postName, @QueryParam("name") String getName, @Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception {
        // This will throw exceptions while request.
        return new ServerResponse(StatusCode.Success, "post OK");
    }
    @Path("/restCRUD")
    @PUT
    @Produces({ MediaType.APPLICATION_JSON })
    public ServerResponse test_put(@FormParam("name") String postName, @QueryParam("name") String getName, @Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception {
        // This will throw exceptions while request.
        return new ServerResponse(StatusCode.Success, "put OK");
    }
    @Path("/restCRUD")
    @DELETE
    @Produces({ MediaType.APPLICATION_JSON })
    public ServerResponse test_delete(@FormParam("name") String postName, @QueryParam("name") String getName, @Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception {
        // This will throw exceptions while request.
        return new ServerResponse(StatusCode.Success, "delete OK");
    }
    
    @Path("/jsonString")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public ServerResponse test_getJsonStr(@QueryParam("name") String getName, @Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception {
        // This will throw exceptions while request.
        return new ServerResponse(StatusCode.Success, "string");
    }
    
    
    @Path("/jsonAry")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public ServerResponse test_getJsonAry(@QueryParam("name") String getName, @Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception {
        // This will throw exceptions while request.
        List<VoUser> users = new ArrayList<VoUser>();
        users.add(new VoUser());
        users.add(new VoUser());
        return new ServerResponse(StatusCode.Success, users);
    }
    
    @Path("/jsonObj")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public ServerResponse test_getJsonMap(@QueryParam("name") String getName, @Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception {
        // This will throw exceptions while request.
        
        Map<String,Object> userMap = new HashMap<String, Object>();
        userMap.put("name", "caa");
        
        
        Map<String,Object> initMap = new HashMap<String, Object>();
        initMap.put("a", userMap);
        initMap.put("d", "e");
        initMap.put("eee", new VoUser());
        //return initMap;
        return new ServerResponse(StatusCode.Success, initMap);
        
    }
    
    @Path("/fail")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public ServerResponse test_failResult(@QueryParam("name") String getName, @Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception {

        return new ServerResponse(StatusCode.Error, "Failed");
    }
    
    
    @Path("/session")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public ServerResponse test_session(@QueryParam("name") String getName, @Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception {
      //  request.setAttribute("A", arg1);
      //  request.s
        HttpSession session= request.getSession(true);
        Object foo = session.getAttribute("foo");
        if (foo!=null) {
            System.out.println(foo.toString());
        } else {
            foo = "bar";
            session.setAttribute("foo", "bar");
        }
        return new ServerResponse(StatusCode.Success, foo);
    }
    
    
    @Path("/accessKey")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public ServerResponse test_accessKey(@QueryParam("name") String getName, @Context HttpServletRequest request, @Context HttpServletResponse response) throws Exception {
      //  request.setAttribute("A", arg1);
        return new ServerResponse(StatusCode.Success,  request.getAttribute("accessKey"));
    }
    
    
}
