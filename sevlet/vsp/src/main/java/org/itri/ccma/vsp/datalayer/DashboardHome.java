package org.itri.ccma.vsp.datalayer;

// Generated 2013/2/4 ¤W¤È 10:41:41 by Hibernate Tools 3.4.0.CR1

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * Home object for domain model class Dashboard.
 * @see org.itri.ccma.vsp.datalayer.Dashboard
 * @author Hibernate Tools
 */
@Stateless
public class DashboardHome {

	private static final Log log = LogFactory.getLog(DashboardHome.class);

	@PersistenceContext
	private EntityManager entityManager;

	public void persist(Dashboard transientInstance) {
		log.debug("persisting Dashboard instance");
		try {
			entityManager.persist(transientInstance);
			log.debug("persist successful");
		} catch (RuntimeException re) {
			log.error("persist failed", re);
			throw re;
		}
	}

	public void remove(Dashboard persistentInstance) {
		log.debug("removing Dashboard instance");
		try {
			entityManager.remove(persistentInstance);
			log.debug("remove successful");
		} catch (RuntimeException re) {
			log.error("remove failed", re);
			throw re;
		}
	}

	public Dashboard merge(Dashboard detachedInstance) {
		log.debug("merging Dashboard instance");
		try {
			Dashboard result = entityManager.merge(detachedInstance);
			log.debug("merge successful");
			return result;
		} catch (RuntimeException re) {
			log.error("merge failed", re);
			throw re;
		}
	}

	public Dashboard findById(Long id) {
		log.debug("getting Dashboard instance with id: " + id);
		try {
			Dashboard instance = entityManager.find(Dashboard.class, id);
			log.debug("get successful");
			return instance;
		} catch (RuntimeException re) {
			log.error("get failed", re);
			throw re;
		}
	}
}
