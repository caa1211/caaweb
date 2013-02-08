package org.itri.ccma.vsp.servicelayer;

import java.text.SimpleDateFormat;
import java.util.Date;
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
import org.itri.ccma.vsp.bizlayer.hq.BoHQAgent;
import org.itri.ccma.vsp.bizlayer.hq.BoHQAutoDiscovery;
import org.itri.ccma.vsp.bizlayer.hq.BoHQGroup;
import org.itri.ccma.vsp.bizlayer.hq.BoHQMetric;
import org.itri.ccma.vsp.bizlayer.hq.BoHQResource;
import org.itri.ccma.vsp.servicelayer.response.*;
import org.itri.ccma.vsp.servicelayer.vo.VoGroup;

@Path("/h")
public class HQService {

    public HQService(){}
    
    /**
     * HQ AgentResource GET  
     * @return Return Resource list
     * @throws Exception 
     */
    @Path("/agentResource")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public ServerResponse agentResource_get(
    	@QueryParam("agentId") Integer agentId,
    	@QueryParam("verbose") boolean verbose,
    	@QueryParam("children") boolean children
    	) throws Exception {
        BoHQResource resource = new BoHQResource();
        Object res = resource.getResourceByAgentId(agentId, verbose, children);
        return  new ServerResponse(res!=null?StatusCode.Success:StatusCode.Error, res);
    }
    
    /**
     * HQ Resource GET  
     * @return Return Resource list
     * @throws Exception 
     */
    @Path("/resource")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public ServerResponse resource_get(
    	@QueryParam("resourceId") Integer resourceId,
    	@QueryParam("verbose") boolean verbose,
    	@QueryParam("children") boolean children
    	) throws Exception {
        BoHQResource resource = new BoHQResource();
        Object res = resource.getResourceById(resourceId, verbose, children);
        return  new ServerResponse(res!=null?StatusCode.Success:StatusCode.Error, res);
    }
    
    /**
     * HQ Metric GET  
     * @return Return Matric list
     * @throws Exception 
     */
    @Path("/metric")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public ServerResponse matric_get(
    	@QueryParam("resourceId") Integer resourceId,
    	@QueryParam("onlyEnabled") boolean onlyEnabled
    	) throws Exception {
    	
    	if(resourceId == null){
    		throw new Exception("parameters failed");
    	}
    	
    	BoHQMetric bo = new BoHQMetric();
    	Object res;
        if(onlyEnabled == false){
        	res = bo.getListMetrics(resourceId);
        }else {
        	res = bo.getListEnabledMetrics(resourceId);
        }

        return  new ServerResponse(res!=null?StatusCode.Success:StatusCode.Error, res);
    }

    /**
     * HQ Metric GET  
     * @return Return Matric list
     * @throws Exception 
     */
    @Path("/metricData")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public ServerResponse matricData_get(
    	@QueryParam("metricId") Integer metricId,
    	@QueryParam("start") String start,
    	@QueryParam("end") String end
    	) throws Exception {
    	
    	if(metricId == null){
    		throw new Exception("parameters failed");
    	}
    	
    	Object res;
    	if(start != null && end != null){
		SimpleDateFormat sdf = new SimpleDateFormat(
				"yyyy/MM/dd HH:mm:ss");
		Date startDate = new Date();
		Date endDate = new Date();
		try {
			startDate = sdf.parse(start);
			endDate = sdf.parse(end);
		} catch (Exception e) {
			throw new Exception("date format failed, should be: yyyy/MM/dd HH:mm:ss");
		}
			long startTime = startDate.getTime();
			long endTime = endDate.getTime();
			BoHQMetric bo = new BoHQMetric();
			res = bo.getMetricData(metricId, startTime, endTime);
		} else {
			BoHQMetric bo = new BoHQMetric();
			 res = bo.getMetricData(metricId);
		}
        return  new ServerResponse(res!=null?StatusCode.Success:StatusCode.Error, res);
    }

	/**
	 * HQ Group GET
	 * 
	 * @param id
	 *            id of group.
	 * @return Return group
	 */
    @Path("/group")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public ServerResponse group_get(@QueryParam("id") Integer id, @QueryParam("name") String name) throws Exception {
        BoObject bo = new BoHQGroup();
        VoGroup vg = null;
        try{
            if(id!=null){
                vg = ((BoHQGroup)bo).getGroupById(id);
            }else if(name!=null){
                vg = ((BoHQGroup)bo).getGroupByName(name);
            }
        }catch(Exception e){
          return  new ServerResponse(StatusCode.Error, "not find");
        }
        
        return  new ServerResponse(vg!=null?StatusCode.Success:StatusCode.Error, vg);
    }
    
	/**
	 * HQ Group POST
	 * @param name
	 * @param location
	 * @param description         
	 * @return Return group
	 */
    @Path("/group")
    @POST
    @Produces({ MediaType.APPLICATION_JSON })
    public ServerResponse group_post(
            @FormParam("name") String name, 
            @FormParam("location") String location, 
            @FormParam("description") String description) throws Exception {
        BoObject bo = new BoHQGroup();
        VoGroup vg = new VoGroup();
        vg.setName(name);
        vg.setDescription(description);
        vg.setLocation(location);
        VoGroup resGroup = null;
        try{
            resGroup = ((BoHQGroup)bo).addGroup(vg);
        }catch(Exception e){
            return  new ServerResponse(StatusCode.Error, "not find");
        }
        
        return  new ServerResponse(resGroup!=null?StatusCode.Success:StatusCode.Error, resGroup);
    }

	/**
	 * HQ Group PUT
	 * @param id
	 * @param name
	 * @param location
	 * @param description         
	 * @return Return new group
	 */
    @Path("/group")
    @PUT
    @Produces({ MediaType.APPLICATION_JSON })
    public ServerResponse group_put(
            @FormParam("id") Integer id,
            @FormParam("name") String name,
            @FormParam("newName") String newName,
            @FormParam("location") String location, 
            @FormParam("description") String description) throws Exception {
        BoObject bo = new BoHQGroup();
        VoGroup vg = new VoGroup();
        vg.setName(newName);
        vg.setDescription(description);
        vg.setLocation(location);
        
        VoGroup resGroup = null;
        try{
            if(id!=null){
                vg.setName(name);
                resGroup = ((BoHQGroup)bo).updateGroupById(id, vg);
            }else if(name!=null){
                resGroup = ((BoHQGroup)bo).updateGroupByName(name, vg);
            }
        }catch(Exception e){
            return  new ServerResponse(StatusCode.Error, "not find");
        }
        
        return  new ServerResponse(resGroup!=null?StatusCode.Success:StatusCode.Error, resGroup);
    }
    
	/**
	 * HQ Group Delete
	 * @param id  
	 * @return Return boolean
	 */
    @Path("/group")
    @DELETE
    @Produces({ MediaType.APPLICATION_JSON })
    public ServerResponse group_del(
            @FormParam("id") Integer id,
            @FormParam("name") String name) throws Exception {
        BoObject bo = new BoHQGroup();
        boolean res = false;
        try{
            if(id!=null){
                res = ((BoHQGroup)bo).delGroupById(id);
            }else if(name!=null){
                res = ((BoHQGroup)bo).delGroupByName(name);
            }
        }catch(Exception e){
            return  new ServerResponse(StatusCode.Error, "not find");
        }

        return  new ServerResponse(res==true?StatusCode.Success:StatusCode.Error, res==true?"success":"error");
    }
    
	/**
	 * HQ Groups GET
	 * @return Return all groups
	 */
    @Path("/groups")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public ServerResponse allGroups_get() throws Exception {
    	BoHQGroup bo = new BoHQGroup();
        List<VoGroup> res;
        try{
            res = bo.getAllGroups();
        }catch(Exception e){
            return  new ServerResponse(StatusCode.Error, "not find");
        }
        return  new ServerResponse(res!=null?StatusCode.Success:StatusCode.Error, res);
    }
  
	/**
	 * HQ Groups GET
	 * @return Return all groups
	 */
    /*
    @Path("/groups")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public ServerResponse allGroups_get() throws Exception {
        BoObject bo = new BoHQGroup();
        Object res;
        try{
            res = ((BoHQGroup)bo).getAllGroups();
        }catch(Exception e){
            return  new ServerResponse(StatusCode.Error, "not find");
        }
        return  new ServerResponse(res!=null?StatusCode.Success:StatusCode.Error, res);
    }
    */

	/**
	 * HQ autodiscovery GET
	 * @return Return all auto discovery platform
	 */
    @Path("/autodiscovery")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public ServerResponse autodiscovery_get(
    		@QueryParam("isApprove") Boolean isApprove
    		) throws Exception {
    	if(isApprove == null){
    		isApprove = false;
    	}
      	BoHQAutoDiscovery bo = new BoHQAutoDiscovery();
        Object res;
        try{
            res = bo.getQueue(isApprove);
        }catch(Exception e){
            return  new ServerResponse(StatusCode.Error, "not find");
        }
        return  new ServerResponse(res!=null?StatusCode.Success:StatusCode.Error, res);
    }
    

	/**
	 * HQ agents GET
	 * @return Return all auto discovery platform
	 */
    @Path("/agents")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public ServerResponse allAgent_get(
    		@QueryParam("isRunning") Boolean isRunning
    		) throws Exception {
    	
    	if(isRunning == null){
    		isRunning = false;
    	}
    
    	BoHQAgent bo = new BoHQAgent();
        Object res;
        try{
        	if(isRunning){
        		res = bo.getAllRunningAgents();
        	}else{
        		res = bo.getAllAgents();
        	}
        }catch(Exception e){
            return  new ServerResponse(StatusCode.Error, "not find");
        }
        return  new ServerResponse(res!=null?StatusCode.Success:StatusCode.Error, res);
    }
    
}
