package org.itri.ccma.vsp.bizlayer.db;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import org.hibernate.Criteria;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;
import org.itri.ccma.vsp.bizlayer.BoObject;
import org.itri.ccma.vsp.datalayer.Company;
import org.itri.ccma.vsp.datalayer.User;
import org.itri.ccma.vsp.datalayer.User2company;
import org.itri.ccma.vsp.servicelayer.vo.VoCompany;

public class BoCompany extends BoObject{

	@SuppressWarnings("finally")
	public boolean createCompany(VoCompany vc){
	
		Session session = HibernateUtil.getSessionFactory().openSession();
		Transaction tx = null;
		Company company = null;
				
		try{
			tx = session.beginTransaction();
			Criteria criteria = session.createCriteria(Company.class).add(Restrictions.eq("name", vc.getName()));
			
			List result = criteria.list();
			if (result.isEmpty()) {
				company = new Company();
				company.setName(vc.getName());
				company.setPhone(vc.getPhone());
				company.setEmail(vc.getEmail());
				company.setAddress(vc.getAddress());
				
				session.save(company);
			}
			tx.commit();
		
		} catch (Exception e){
			if (tx != null && tx.isActive()) {
				try {
					tx.rollback();
				} catch (HibernateException he){
					throw he;
				} finally{
					HibernateUtil.getSessionFactory().getCurrentSession().close();
					return false;
				}
			}
		}
		HibernateUtil.getSessionFactory().getCurrentSession().close();
		
		if(company.getCompanyId()>0)
			return true;
		else
			return false;
	}
	
	@SuppressWarnings("finally")
	public boolean updateCompanyByName(String name, VoCompany vc){
	
		Session session = HibernateUtil.getSessionFactory().openSession();
		Transaction tx = null;
		Company company = null;
				
		try{
			tx = session.beginTransaction();
			Criteria criteria = session.createCriteria(Company.class);
			criteria.add(Restrictions.eq("name", name));
			company = (Company) criteria.uniqueResult();
			company.setName(vc.getName());
			company.setPhone(vc.getPhone());
			company.setEmail(vc.getEmail());
			company.setAddress(vc.getAddress());
			
			session.merge(company);
			tx.commit();
		
		} catch (Exception e){
			if (tx != null && tx.isActive()) {
				try {
					tx.rollback();
				} catch (HibernateException he){
					throw he;
				} finally{
					HibernateUtil.getSessionFactory().getCurrentSession().close();
					return false;
				}
			}
		}
		HibernateUtil.getSessionFactory().getCurrentSession().close();
		
		if(company.getCompanyId()>0)
			return true;
		else
			return false;
	}
	
	@SuppressWarnings("finally")
	public boolean deleteCompanyByName(String name){
		
		Session session = HibernateUtil.getSessionFactory().openSession();
		Transaction tx = null;
		Boolean isSuccess = false;
		Company  company = null;
		
		try{
			tx = session.beginTransaction();
			Criteria criteria = session.createCriteria(Company.class);
			criteria.add(Restrictions.eq("name", name));
			company = (Company) criteria.uniqueResult();
			
			if(company != null)
			{
				session.delete(company);
				tx.commit();
				isSuccess = true;
			}
		} catch (Exception e){
			if (tx != null && tx.isActive()) {
				try {
					tx.rollback();
				} catch (HibernateException he){
					throw he;
				} finally{
					HibernateUtil.getSessionFactory().getCurrentSession().close();
					return false;
				}
			}
		}
		
		HibernateUtil.getSessionFactory().getCurrentSession().close();
		return isSuccess;
	}
	
	@SuppressWarnings("finally")
	public List<VoCompany> getCompanyByUserName(String name){
		
		User user = null;
		List<VoCompany> resultList = new ArrayList<VoCompany>();
		Session session = HibernateUtil.getSessionFactory().openSession();
		Transaction tx = null;
		try{
			tx = session.beginTransaction();
			Criteria criteria = session.createCriteria(User.class);
			criteria.add(Restrictions.eq("name", name));
			user  = (User) criteria.uniqueResult(); 
	
			Set<User2company> set = user.getUser2companies();
			for(Iterator<User2company> itr = set.iterator(); itr.hasNext();){
				Company company = (Company)itr.next().getCompany();
				VoCompany vc = new VoCompany();
				vc.setId(company.getCompanyId());
				vc.setName(company.getName());
				vc.setPhone(company.getPhone());
				vc.setEmail(company.getEmail());
				vc.setAddress(company.getAddress());
				resultList.add(vc);
			}
			
			tx.commit();
		} catch (Exception e){
			if (tx != null && tx.isActive()) {
				try {
					tx.rollback();
				} catch (HibernateException he){
					throw he;
				} finally{
					HibernateUtil.getSessionFactory().getCurrentSession().close();
					return resultList;
				}
			}
		}
		HibernateUtil.getSessionFactory().getCurrentSession().close();
		
		return resultList;
	}
}
