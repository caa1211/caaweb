package org.itri.ccma.vsp.datalayer;

// Generated 2013/2/4 �W�� 10:41:39 by Hibernate Tools 3.4.0.CR1

import java.util.HashSet;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

/**
 * Company generated by hbm2java
 */
@Entity
@Table(name = "company", catalog = "vsp")
public class Company implements java.io.Serializable {

	private Long companyId;
	private String name;
	private String phone;
	private String email;
	private String address;
	private Set<User2company> user2companies = new HashSet<User2company>(0);
	private Set<Application> applications = new HashSet<Application>(0);
	private Set<Hqserver> hqservers = new HashSet<Hqserver>(0);

	public Company() {
	}

	public Company(String name, String phone, String email, String address,
			Set<User2company> user2companies, Set<Application> applications,
			Set<Hqserver> hqservers) {
		this.name = name;
		this.phone = phone;
		this.email = email;
		this.address = address;
		this.user2companies = user2companies;
		this.applications = applications;
		this.hqservers = hqservers;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "company_id", unique = true, nullable = false)
	public Long getCompanyId() {
		return this.companyId;
	}

	public void setCompanyId(Long companyId) {
		this.companyId = companyId;
	}

	@Column(name = "name")
	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "phone", length = 128)
	public String getPhone() {
		return this.phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	@Column(name = "email", length = 128)
	public String getEmail() {
		return this.email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	@Column(name = "address", length = 128)
	public String getAddress() {
		return this.address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "company")
	public Set<User2company> getUser2companies() {
		return this.user2companies;
	}

	public void setUser2companies(Set<User2company> user2companies) {
		this.user2companies = user2companies;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "company")
	public Set<Application> getApplications() {
		return this.applications;
	}

	public void setApplications(Set<Application> applications) {
		this.applications = applications;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "company")
	public Set<Hqserver> getHqservers() {
		return this.hqservers;
	}

	public void setHqservers(Set<Hqserver> hqservers) {
		this.hqservers = hqservers;
	}

}
