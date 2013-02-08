package org.itri.ccma.vsp.bizlayer.db;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;
import org.itri.ccma.vsp.bizlayer.BoObject;
import org.itri.ccma.vsp.datalayer.User;
import org.itri.ccma.vsp.servicelayer.vo.VoUser;

public class BoUser extends BoObject
{	
	@SuppressWarnings("finally")
	public boolean createUser(VoUser vu){
		Session session = HibernateUtil.getSessionFactory().openSession();
		Transaction tx = null;
		User user = null;
				
		try{
			tx = session.beginTransaction();
			Criteria criteria = session.createCriteria(User.class).add(Restrictions.eq("name", vu.getName()));
			
			List result = criteria.list();
			if (result.isEmpty()) {
				user = new User();
				user.setName(vu.getName());
				user.setPassword(vu.getPassword());
				
				session.save(user);
			}
			
			tx.commit();
		}catch (Exception e) {
			if (tx != null && tx.isActive()) {
				try {
					tx.rollback();
				} catch (HibernateException he) {
					throw he;
				} finally {
					HibernateUtil.getSessionFactory().getCurrentSession().close();
					return false;
				}
			}
		}
		
		HibernateUtil.getSessionFactory().getCurrentSession().close();
		if(user.getUserId() >0)
			return true;
		else
			return false;
	}
	
	@SuppressWarnings("finally")
	public boolean deleteUserByName(String name){
		
		Session session = HibernateUtil.getSessionFactory().openSession();
		Transaction tx = null;
		Boolean isSuccess = false;
		User user = null;
		
		try{
			tx = session.beginTransaction();
			Criteria criteria = session.createCriteria(User.class);
			criteria.add(Restrictions.eq("name", name));
			user = (User) criteria.uniqueResult();
			
			if(user != null)
			{
				session.delete(user);
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
}
