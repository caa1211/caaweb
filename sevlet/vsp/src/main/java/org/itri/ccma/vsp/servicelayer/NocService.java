package org.itri.ccma.vsp.servicelayer;

import java.util.List;

import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.itri.ccma.vsp.bizlayer.BoObject;
import org.itri.ccma.vsp.bizlayer.db.BoCompany;
import org.itri.ccma.vsp.servicelayer.response.*;
import org.itri.ccma.vsp.servicelayer.vo.VoCompany;

@Path("/n")
public class NocService {

    public NocService(){}
    
    // **************************************************************************
    // @author Jose
    // resource: /application
    // type: get, post, delete, put
    // **************************************************************************
    
    @Path("/application")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public ServerResponse application_get() {
        return new ServerResponse(StatusCode.Success, "get application ok");
    }
    @Path("/application")
    @POST
    @Produces({ MediaType.APPLICATION_JSON })
    public ServerResponse application_post() {
        return new ServerResponse(StatusCode.Success, "post application ok");
    }
    @Path("/application")
    @DELETE
    @Produces({ MediaType.APPLICATION_JSON })
    public ServerResponse application_delete() {
        return new ServerResponse(StatusCode.Success, "del application ok");
    }
    @Path("/application")
    @PUT
    @Produces({ MediaType.APPLICATION_JSON })
    public ServerResponse application_put() {
        return new ServerResponse(StatusCode.Success, "put application ok");
    }
    
    // **************************************************************************
    // @author Jose
    // resource: /company
    // type: get, post, delete, put
    // **************************************************************************
    
    @Path("/company")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public ServerResponse company_get(@QueryParam("name") String name)throws Exception {
    	BoObject bo = new BoCompany();
        List<VoCompany> vg = null;
        try{
            vg = ((BoCompany)bo).getCompanyByUserName(name);
        }catch(Exception e){
          return  new ServerResponse(StatusCode.Error, "not find");
        }
    	return new ServerResponse(StatusCode.Success, vg);
    }
    @Path("/company")
    @POST
    @Produces({ MediaType.APPLICATION_JSON })
    public ServerResponse company_post(@FormParam("name") String name, 
            @FormParam("phone") String phone, 
            @FormParam("email") String email,
            @FormParam("address") String address)throws Exception {
    	BoObject bo = new BoCompany();
    	VoCompany vc = new VoCompany();
    	vc.setName(name);
    	vc.setPhone(phone);
    	vc.setEmail(email);
    	vc.setAddress(address);
    	boolean res = false;
    	try{
            res = ((BoCompany)bo).createCompany(vc);
        }catch(Exception e){
          return  new ServerResponse(StatusCode.Error, "not find");
        }
    	if(res==true){
            return  new ServerResponse(StatusCode.Success);
        }else{
            return  new ServerResponse(StatusCode.Error);
        }
    }
    @Path("/company")
    @DELETE
    @Produces({ MediaType.APPLICATION_JSON })
    public ServerResponse company_delete(@FormParam("name") String name) {
    	BoObject bo = new BoCompany();
    	boolean res = false;
    	try{
            res = ((BoCompany)bo).deleteCompanyByName(name);
        }catch(Exception e){
          return  new ServerResponse(StatusCode.Error, "not find");
        }
    	if(res==true){
            return  new ServerResponse(StatusCode.Success);
        }else{
            return  new ServerResponse(StatusCode.Error);
        }
    }
    @Path("/company")
    @PUT
    @Produces({ MediaType.APPLICATION_JSON })
    public ServerResponse company_put(@FormParam("name") String name, 
    		@FormParam("newName") String newName,
    		@FormParam("phone") String phone, 
            @FormParam("email") String email,
            @FormParam("address") String address) {
    	BoObject bo = new BoCompany();
    	VoCompany vc = new VoCompany();
    	vc.setName(newName);
    	vc.setPhone(phone);
    	vc.setEmail(email);
    	vc.setAddress(address);
    	boolean res = false;
    	try{
            res = ((BoCompany)bo).updateCompanyByName(name, vc);
        }catch(Exception e){
          return  new ServerResponse(StatusCode.Error, "not find");
        }
    	if(res==true){
            return  new ServerResponse(StatusCode.Success);
        }else{
            return  new ServerResponse(StatusCode.Error);
        }
    }
    
    // **************************************************************************
    // @author Jose
    // resource: /login
    // type: post
    // **************************************************************************
    
    @Path("/login")
    @POST
    @Produces({ MediaType.APPLICATION_JSON })
    public ServerResponse login_post() {
        return new ServerResponse(StatusCode.Success, "post login ok");
    }
   
}
