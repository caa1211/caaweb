package org.itri.ccma.vsp.servicelayer.vo;

public class VoCompany {
	
	private Long id;
	private String name;
	private String phone;
	private String email;
	private String address;
	
	public Long getId() {
		return id;
	}
	public void setId(Long Id) {
		this.id = Id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
}
