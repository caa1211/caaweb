package org.itri.ccma.vsp.bizlayer.hq;
import java.util.ArrayList;
import java.util.List;
import org.hyperic.hq.hqapi1.GroupApi;
import org.hyperic.hq.hqapi1.types.Group;
import org.hyperic.hq.hqapi1.types.GroupResponse;
import org.hyperic.hq.hqapi1.types.GroupsResponse;
import org.hyperic.hq.hqapi1.types.Resource;
import org.hyperic.hq.hqapi1.types.StatusResponse;
import org.itri.ccma.vsp.servicelayer.vo.VoGroup;
import org.itri.ccma.vsp.servicelayer.vo.VoResource;

public class BoHQGroup extends HQApiBase{

    public VoGroup getGroup(GroupApi api, GroupResponse gResponse, boolean deep) throws Exception{
        Group g = gResponse.getGroup();
        if(g ==  null){
            return null;
        }
        VoGroup vg = new VoGroup();
        vg.setName(g.getName());
        vg.setId(g.getId());
        vg.setRid(g.getResourceId());
        vg.setLocation(g.getLocation());
        vg.setDescription(g.getDescription());

        List<VoResource> resources = new ArrayList<VoResource>();
        if(g.getResource().size()!=0){
            for(Resource r : g.getResource()){
                VoResource vr = new VoResource();
                vr.setId(r.getId());
                vr.setName(r.getName());
                resources.add(vr);
            } 
        }
        vg.setResources(resources);
        return vg;
    }
    
    public VoGroup getGroupByName(String name) throws Exception{
        GroupApi api = getApi().getGroupApi();
        GroupResponse gResponse = api.getGroup(name);
        return getGroup(api, gResponse, true);
    }
    
    public VoGroup getGroupById(Integer id) throws Exception{
        GroupApi api = getApi().getGroupApi();
        GroupResponse gResponse = api.getGroup(id);
        return getGroup(api, gResponse, true);
    }
    
    public VoGroup addGroup(VoGroup vg) throws Exception {
        GroupApi api = getApi().getGroupApi();
        Group group = new Group();
        group.setName(vg.getName());
        
        group.setLocation(vg.getLocation());
        group.setDescription(vg.getDescription());
        GroupResponse res = api.createGroup(group);
     
        if(res.getStatus().value().equals("Success") && res.getGroup()!=null){
            Group resGroup =  res.getGroup();
            VoGroup resVg = new VoGroup();
            resVg.setName(resGroup.getName());
            resVg.setId(resGroup.getId());
            resVg.setRid(resGroup.getResourceId());
            resVg.setLocation(resGroup.getLocation());
            resVg.setDescription(resGroup.getDescription());
            return resVg; 
        }else{
            return null;
        }
    }

    public VoGroup updateGroup(GroupApi api, GroupResponse gResponse, VoGroup vg ) throws Exception{
        Group g = gResponse.getGroup();
        if(g ==  null){
            return null;
        }
        boolean isUpdate = false;
        if(vg.getName()!=null){
            g.setName(vg.getName());

            isUpdate = true;
        }
        if(vg.getDescription()!=null){
            g.setDescription(vg.getDescription());
            isUpdate = true;
        }
        if(vg.getLocation()!=null){
            g.setLocation(vg.getLocation());
            isUpdate = true;
        }
        
        if(isUpdate){
            GroupResponse res =  api.updateGroup(g);
            if(res.getStatus().value().equals("Success")  && res.getGroup()!=null){
                Group resGroup =  res.getGroup();
                VoGroup resVg = new VoGroup();
                resVg.setName(resGroup.getName());
                resVg.setId(resGroup.getId());
                resVg.setRid(resGroup.getResourceId());
                resVg.setLocation(resGroup.getLocation());
                resVg.setDescription(resGroup.getDescription());
                return resVg; 
            }else{
                return null;
            }
        }else{
            return null;
        }
    }
    
    public VoGroup updateGroupByName(String name, VoGroup vg) throws Exception {
        GroupApi api = getApi().getGroupApi();
        GroupResponse gResponse = api.getGroup(name);
        return updateGroup(api, gResponse, vg);
    }
    
    public VoGroup updateGroupById(Integer id, VoGroup vg) throws Exception {
        GroupApi api = getApi().getGroupApi();
        return updateGroup(getApi().getGroupApi(), api.getGroup(id), vg);
    }
  
    public Boolean delGroup(GroupApi api, GroupResponse gResponse) throws Exception {
        Group g = gResponse.getGroup();
        if(g ==  null){
            return null;
        }
        StatusResponse res =  api.deleteGroup(g.getId());
        if(res.getStatus().value().equals("Success")){
            return true; 
        }else{
            return false;
        }
    }
    
    
    public Boolean delGroupByName(String name) throws Exception {
        GroupApi api = getApi().getGroupApi();
        GroupResponse gResponse = api.getGroup(name);
        return delGroup(api, gResponse);
    }
    
    public Boolean delGroupById(Integer id) throws Exception {
        GroupApi api = getApi().getGroupApi();
        GroupResponse gResponse = api.getGroup(id);
        return delGroup(api, gResponse);
    }
    
    public List<VoGroup> getAllGroups() throws Exception {
        GroupApi api = getApi().getGroupApi();
        GroupsResponse getResponse = api.getMixedGroups();
        List<VoGroup> groups = new ArrayList<VoGroup>();
        for (Group g : getResponse.getGroup()) {
            VoGroup vg = new VoGroup();
            vg.setName(g.getName());
            vg.setId(g.getId());
            vg.setRid(g.getResourceId());
            vg.setDescription(g.getDescription());
            vg.setLocation(g.getLocation());
            List<VoResource> resources = new ArrayList<VoResource>();
            if(g.getResource().size()!=0){
                for(Resource r : g.getResource()){
                    VoResource vr = new VoResource();
                    vr.setId(r.getId());
                    vr.setName(r.getName());
                    resources.add(vr);
                } 
            }
            vg.setResources(resources);
            groups.add(vg);
        }
        return groups;
    }

    
    public List<Group> getAllGroups_directly() throws Exception {
        GroupApi api = getApi().getGroupApi();
        GroupsResponse getResponse = api.getMixedGroups();
        return getResponse.getGroup();
    }
    
    //for test
    public static void main(String[] args) throws Exception {}


}
