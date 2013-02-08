package org.itri.ccma.vsp.test.biz.hq;

import org.itri.ccma.vsp.bizlayer.hq.BoHQGroup;
import org.itri.ccma.vsp.servicelayer.vo.VoGroup;

import junit.framework.TestCase;

public class TestHQGroup extends TestCase{
    
    public static Integer GID ;
    public String name = "testGroup_中文";

    /*
    void hqAssertSuccess(Response response) {
        String error = (response.getError() != null) ?
            response.getError().getReasonText() : "";
            
        assertEquals(error, ResponseStatus.SUCCESS, response.getStatus());
    }
    
         */
    //create / post
    public void testAdd() throws Exception {
        BoHQGroup bg = new BoHQGroup();
        VoGroup vg = new VoGroup();
        vg.setName(name);
        vg.setDescription("說明");
        vg.setLocation("ITRI");
        System.out.println( bg.addGroup(vg) );
        VoGroup resVg = bg.addGroup(vg);
        GID = resVg.getId();
        assertNotNull("create group failed", resVg);
    }
     
    //get
    public void testGet() throws Exception {
        BoHQGroup bg = new BoHQGroup();
        VoGroup vg = bg.getGroupById(GID);
        assertNotNull("get group failed", vg);
    }
    
    //put
    public void testPut() throws Exception {
        String newLocation = "新竹Itri";
        BoHQGroup bg = new BoHQGroup();
        VoGroup vg = new VoGroup();
        vg.setLocation(newLocation);
        VoGroup resvg = bg.updateGroupById(GID, vg);
        assertEquals("error", newLocation, resvg.getLocation());
    }
    
    //del
    public void testDel() throws Exception {
        BoHQGroup bg = new BoHQGroup();
        boolean resvg = bg.delGroupById(GID);
        //assertEquals("error", true, resvg);
        VoGroup vg = bg.getGroupById(GID);
        assertNull("get group failed", vg);
    }
    
    
}
