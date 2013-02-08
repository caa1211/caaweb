package org.itri.ccma.vsp.bizlayer.hq;

import java.util.List;

import org.hyperic.hq.hqapi1.MetricApi;
import org.hyperic.hq.hqapi1.types.Metric;
import org.hyperic.hq.hqapi1.types.MetricData;
import org.hyperic.hq.hqapi1.types.MetricDataResponse;
import org.hyperic.hq.hqapi1.types.MetricsResponse;
import org.hyperic.hq.hqapi1.types.Resource;

public class BoHQMetric extends HQApiBase {

	public List<Metric> getListMetrics(Integer rid) throws Exception {
		return getListMetrics(new BoHQResource().getResourceById(rid));
	}
	
	public List<Metric> getListMetrics(Resource r) throws Exception {
		MetricApi api = getApi().getMetricApi();
		MetricsResponse resp = api.getMetrics(r);
		return resp.getMetric();
	}
	
	public List<Metric> getListEnabledMetrics(Integer rid) throws Exception {
		return getListEnabledMetrics(new BoHQResource().getResourceById(rid));
	}
	
	public List<Metric> getListEnabledMetrics(Resource r) throws Exception {
		MetricApi api = getApi().getMetricApi();
		MetricsResponse resp = api.getEnabledMetrics(r);
		return resp.getMetric();
	}

	public MetricData getMetricData( Metric m, long start, long end ) throws Exception{
		return getMetricData(m.getId(), start, end);
	}
	
	public MetricData getMetricData( Integer mid, long start, long end ) throws Exception{
		 MetricApi api = getApi().getMetricApi();
		 
		 MetricDataResponse dataResponse = api.getMetricData(mid,start, end);
		 return  dataResponse.getMetricData();
	}
	
	public MetricData getMetricData( Integer mid) throws Exception{
	     long end = System.currentTimeMillis();
	     long start = end - (8 * 60 * 60 * 1000);
	     return this.getMetricData(mid, start, end);
	}
	
	public static void main(String[] args) throws Exception {
		
		  BoHQMetric	bo = new BoHQMetric();
		  List<Metric> r = bo.getListEnabledMetrics(10966);//rid
		  System.out.println();
		 
		  Metric m = r.get(0);
		  System.out.println(m.getId());
		     long end = System.currentTimeMillis();
		     long start = end - (8 * 60 * 60 * 1000); //8 hours
		     MetricData md =bo.getMetricData(11764, start, end);
		     System.out.println();  
		        
   }
	  
}
