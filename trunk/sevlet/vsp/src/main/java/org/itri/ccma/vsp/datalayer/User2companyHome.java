package org.itri.ccma.vsp.datalayer;

// Generated 2013/2/4 ¤W¤È 10:41:41 by Hibernate Tools 3.4.0.CR1

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * Home object for domain model class User2company.
 * @see org.itri.ccma.vsp.datalayer.User2company
 * @author Hibernate Tools
 */
@Stateless
public class User2companyHome {

	private static final Log log = LogFactory.getLog(User2companyHome.class);

	@PersistenceContext
	private EntityManager entityManager;

	public void persist(User2company transientInstance) {
		log.debug("persisting User2company instance");
		try {
			entityManager.persist(transientInstance);
			log.debug("persist successful");
		} catch (RuntimeException re) {
			log.error("persist failed", re);
			throw re;
		}
	}

	public void remove(User2company persistentInstance) {
		log.debug("removing User2company instance");
		try {
			entityManager.remove(persistentInstance);
			log.debug("remove successful");
		} catch (RuntimeException re) {
			log.error("remove failed", re);
			throw re;
		}
	}

	public User2company merge(User2company detachedInstance) {
		log.debug("merging User2company instance");
		try {
			User2company result = entityManager.merge(detachedInstance);
			log.debug("merge successful");
			return result;
		} catch (RuntimeException re) {
			log.error("merge failed", re);
			throw re;
		}
	}

	public User2company findById(Long id) {
		log.debug("getting User2company instance with id: " + id);
		try {
			User2company instance = entityManager.find(User2company.class, id);
			log.debug("get successful");
			return instance;
		} catch (RuntimeException re) {
			log.error("get failed", re);
			throw re;
		}
	}
}
