/** 
 * @license ACL v1.0, CCMA, ITRI, Taiwan, R.O.C (2012/5/17)
 * 
 * (c) 2012 Shao-Kai Yang<ericyang@itri.org.tw>
 * 
 * License: http://www.itri.org.tw/eng/Policy.asp
 */
package idv.jose.service;

import java.io.IOException;
import java.io.OutputStream;
import java.lang.annotation.Annotation;
import java.lang.reflect.Type;

import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.ext.MessageBodyWriter;
import javax.ws.rs.ext.Provider;

import org.codehaus.jackson.map.ObjectMapper;

import com.sun.jersey.api.core.HttpContext;

@Provider
@Produces({ MediaType.TEXT_PLAIN, MediaType.APPLICATION_JSON })
public class JsonMessageBodyWriter implements MessageBodyWriter {
	private ObjectMapper mapper;

	public JsonMessageBodyWriter(@Context HttpContext hc) {
		mapper = new ObjectMapper();
	}

	public long getSize(Object obj, Class type, Type genericType, Annotation[] annotations, MediaType mediaType) {
		return -1;
	}

	public boolean isWriteable(Class type, Type genericType, Annotation[] annotations, MediaType mediaType) {
		return true;
	}

	public void writeTo(Object target, Class type, Type genericType, Annotation[] annotations, MediaType mediaType, MultivaluedMap httpHeaders, OutputStream outputStream) throws IOException, WebApplicationException {
		mapper.writeValue(outputStream, target);
	}

}