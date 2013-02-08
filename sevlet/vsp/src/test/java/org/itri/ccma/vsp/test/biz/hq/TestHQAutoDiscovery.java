package org.itri.ccma.vsp.test.biz.hq;

import java.util.List;


import org.hyperic.hq.hqapi1.types.AIPlatform;
import org.itri.ccma.vsp.bizlayer.hq.BoHQAutoDiscovery;



import junit.framework.TestCase;

public class TestHQAutoDiscovery extends TestCase{
	
	  public void testGetQueue() throws Exception {
		  BoHQAutoDiscovery bo = new BoHQAutoDiscovery();
		  List<AIPlatform> res = bo.getQueue();
		  assertNotNull("get auto discovery failed", res);    
	  }
	  
	  

}
