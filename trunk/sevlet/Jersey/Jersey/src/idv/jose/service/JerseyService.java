/** 
 * @license VDCM v1.0, CCMA, ITRI, Taiwan, R.O.C (2012/5/18)
 * 
 * (c) 2012 Shao-Kai Yang<ericyang@itri.org.tw>
 * 
 * License: http://www.itri.org.tw/eng/Policy.asp
 */
package idv.jose.service;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;



@Path("/REST")
public class JerseyService {
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public Test getJson() {
		Test test = new Test();
		test.setA1("AAAA");
		test.setB1("BBBB");
		return test;
	}

//	 @GET
//	 @Produces(MediaType.TEXT_PLAIN)
//	 public String getText() {
//	 return "AAAAA";
//	 }

	public class Test {
		private String a1;
		private String b1;

		public String getA1() {
			return a1;
		}

		public void setA1(String a1) {
			this.a1 = a1;
		}

		public String getB1() {
			return b1;
		}

		public void setB1(String b1) {
			this.b1 = b1;
		}

	}
}
