package org.itri.ccma.vsp.bizlayer.hq;

import java.util.ArrayList;
import java.util.List;

import org.hyperic.hq.hqapi1.AgentApi;
import org.hyperic.hq.hqapi1.types.Agent;
import org.hyperic.hq.hqapi1.types.AgentResponse;
import org.hyperic.hq.hqapi1.types.AgentsResponse;
import org.hyperic.hq.hqapi1.types.PingAgentResponse;
import org.hyperic.hq.hqapi1.types.ResponseStatus;

public class BoHQAgent extends HQApiBase{

	private AgentApi getAgentApi(){
	    AgentApi api = getApi().getAgentApi();
	    return api;
	}
	
	public List<Agent> getAllAgents() throws Exception{
	      AgentApi api = this.getAgentApi();
		  AgentsResponse response =  api.getAgents();
		  List<Agent> agents = response.getAgent();
		  return agents;
	}
	
    public List<Agent> getAllRunningAgents() throws Exception {
    	List<Agent> agents = new ArrayList<Agent>();
        AgentApi api = this.getAgentApi();

        AgentsResponse response = api.getAgents();
        if (response.getStatus().equals(ResponseStatus.FAILURE)) {
            String err = "Error querying agents: " +
                    response.getError().getReasonText();
            //_log.error(err);
            throw new Exception(err);
        }

        for (Agent a : response.getAgent()) {
            PingAgentResponse pingRespnse = api.pingAgent(a);
            if (pingRespnse.getStatus().equals(ResponseStatus.SUCCESS) &&
                pingRespnse.isUp()) {
            	agents.add(a);
            }
        }
        return agents;
    }
    
    public Agent getAgentById(Integer id) throws Exception {
        AgentApi api = this.getAgentApi();
        AgentResponse response = api.getAgent(id);
        Agent a = response.getAgent();
        return a;
    }
    
    
	public static void main(String[] args) throws Exception {
		/*
		  BoHQAgent	bo = new BoHQAgent();
		  List<Agent>  aa= bo.getAllAgents();
        */
	}
}
