package org.itri.ccma.vsp.test.biz.hq;

import java.util.List;


import org.hyperic.hq.hqapi1.types.Agent;
import org.hyperic.hq.hqapi1.types.Response;
import org.hyperic.hq.hqapi1.types.ResponseStatus;
import org.itri.ccma.vsp.bizlayer.hq.BoHQAgent;

import junit.framework.TestCase;

public class TestHQAgent extends TestCase{

    void hqAssertSuccess(Response response) {
        String error = (response.getError() != null) ?
            response.getError().getReasonText() : "";
        assertEquals(error, ResponseStatus.SUCCESS, response.getStatus());
    }
    
	  public void testGetAllAgent() throws Exception {
		  BoHQAgent bo = new BoHQAgent();
		  List<Agent> res = bo.getAllAgents();
		  assertNotNull("get all agents failed", res);    
		  
	        for (Agent a : res) {
	            assertTrue(a.getAddress().length() > 0);
	            assertTrue(a.getPort() > 0);
	            assertTrue(a.getVersion().length() > 0);
	            assertTrue(a.getId() > 0);
	        }
	        
	  }
	  
	  public void testGetAllRunningAgents() throws Exception {
		  BoHQAgent bo = new BoHQAgent();
		  List<Agent> res = bo.getAllRunningAgents();
		  assertNotNull("get all running agents failed", res);    
		  
	        for (Agent a : res) {
	            assertTrue(a.getAddress().length() > 0);
	            assertTrue(a.getPort() > 0);
	            assertTrue(a.getVersion().length() > 0);
	            assertTrue(a.getId() > 0);
	        }
	        
	  }
	  
}
