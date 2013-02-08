package org.itri.ccma.vsp.test.biz.hq;

import java.util.List;

import org.hyperic.hq.hqapi1.AgentApi;
import org.hyperic.hq.hqapi1.types.Agent;
import org.hyperic.hq.hqapi1.types.Resource;
import org.hyperic.hq.hqapi1.types.ResourceConfig;
import org.hyperic.hq.hqapi1.types.ResourceProperty;
import org.itri.ccma.vsp.bizlayer.hq.BoHQAgent;
import org.itri.ccma.vsp.bizlayer.hq.BoHQGroup;
import org.itri.ccma.vsp.bizlayer.hq.BoHQResource;
import org.itri.ccma.vsp.servicelayer.vo.VoGroup;

import junit.framework.TestCase;

public class TestHQResource extends TestCase{
    private static Agent    _localAgent = null;
    

    protected void validateResource(Resource r) {
        assertNotNull(r);
        assertNotNull(r.getId());
        assertNotNull(r.getName());

        assertNotNull("No resource prototype found for resource id " + r.getId(),
                      r.getResourcePrototype());
        assertTrue(r.getResourcePrototype().getId() > 0);
        assertTrue(r.getResourcePrototype().getName().length() > 0);

        for (ResourceConfig config : r.getResourceConfig()) {
            assertNotNull("Null key found for resoruce id + " + r.getId(),
                          config.getKey());
            assertNotNull("Null value found for key " + config.getKey() +
                          " on resource id " + r.getId(), config.getValue());
        }

        for (ResourceProperty p : r.getResourceProperty()) {
            assertNotNull("Null key found for resoruce id + " + r.getId(),
                          p.getKey());
            assertNotNull("Null value found for key " + p.getKey() +
                          " on resource id " + r.getId(), p.getValue());
        }

        for (Resource child : r.getResource()) {
            validateResource(child);
        }
    }
    
    public void testGetByAgentId() throws Exception {
        BoHQAgent boAgent = new BoHQAgent();
        BoHQResource boResource = new BoHQResource();
        List<Agent>agents = boAgent.getAllAgents();
        
        Agent agent0= agents.get(1);
        System.out.println("agent size: " + agents.size());
        assertTrue("Found 0 platform resources for agent " + agent0.getId(),agents.size() > 0);
        Integer agentId = agent0.getId();
        List<Resource> resources=  boResource.getResourceByAgentId(agentId, false, false);
        
        validateResource(resources.get(0));
     
    }
}
