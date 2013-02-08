package org.itri.ccma.vsp.bizlayer.hq;

import java.util.List;

import org.hyperic.hq.hqapi1.AutodiscoveryApi;
import org.hyperic.hq.hqapi1.HQApi;
import org.hyperic.hq.hqapi1.types.AIPlatform;
import org.hyperic.hq.hqapi1.types.QueueResponse;

public class BoHQAutoDiscovery extends HQApiBase {

    public AutodiscoveryApi getAutodiscoveryApi() {
        HQApi api = getApi();
        return api.getAutodiscoveryApi();
    }
    
	 public List<AIPlatform> getQueue() throws Exception{
		  AutodiscoveryApi api = getAutodiscoveryApi();
	      QueueResponse response = api.getQueue();
	      return response.getAIPlatform();
	 }
	 
	 public List<AIPlatform> getQueue(boolean isApprove) throws Exception{
		  AutodiscoveryApi api = getAutodiscoveryApi();
	      QueueResponse response = api.getQueue();
	      List<AIPlatform> allAIPlatform = response.getAIPlatform();
	      if(isApprove){
		      for(AIPlatform ai: allAIPlatform){
		    	  api.approve(ai.getId());
		      }
	      }
	      return allAIPlatform;
	 }

	 
		public static void main(String[] args) throws Exception {
		}
		

}
