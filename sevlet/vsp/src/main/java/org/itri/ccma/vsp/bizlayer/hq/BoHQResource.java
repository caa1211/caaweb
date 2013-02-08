package org.itri.ccma.vsp.bizlayer.hq;


import java.util.List;

import org.hyperic.hq.hqapi1.ResourceApi;
import org.hyperic.hq.hqapi1.types.Agent;
import org.hyperic.hq.hqapi1.types.Resource;
import org.hyperic.hq.hqapi1.types.ResourcePrototype;
import org.hyperic.hq.hqapi1.types.ResourcePrototypeResponse;
import org.hyperic.hq.hqapi1.types.ResourceResponse;
import org.hyperic.hq.hqapi1.types.ResourcesResponse;

public class BoHQResource extends HQApiBase {

	private ResourceApi getResourceApi() {
		return getApi().getResourceApi();
	}

	public List<Resource> findByPrototype(String type) throws Exception {
		ResourceApi api = getResourceApi();
		ResourcePrototypeResponse protoResponse = api
				.getResourcePrototype(type);
		ResourcePrototype pt = protoResponse.getResourcePrototype();

		ResourcesResponse response = api.getResources(pt, true, true);
		List<Resource> res = response.getResource();
		return res;
	}

	public List<Resource> getResourceByAgentId(Integer agentId)
			throws Exception {
		return this.getResourceByAgentId(agentId, false, false);
	}

	public List<Resource> getResourceByAgentId(Integer agentId,
			boolean verbose, boolean children) throws Exception {
		ResourceApi api = getResourceApi();
		BoHQAgent boAgent = new BoHQAgent();
		Agent agent = boAgent.getAgentById(agentId);
		ResourcesResponse findResponse = api.getResources(agent, verbose,
				children);
		List<Resource> res = findResponse.getResource();
		return res;
	}

	public Resource getResourceById(Integer rid) throws Exception {
		return this.getResourceById(rid, false, false);
	}

	public Resource getResourceById(Integer rid, boolean verbose,
			boolean children) throws Exception {
		ResourceApi api = getResourceApi();
		ResourceResponse response = api.getResource(rid, verbose, children);
		Resource res = response.getResource();
		return res;
	}

	public static void main(String[] args) throws Exception {
		BoHQResource bo = new BoHQResource();
		/*
		 * bo.findByPrototype("CPU"); System.out.println();
		 */
		// --
		Resource r = bo.getResourceById(11141, false, false);
		System.out.println();

	}

}
