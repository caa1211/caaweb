package org.itri.ccma.vsp.datalayer;

// Generated 2013/2/4 ¤W¤È 10:41:41 by Hibernate Tools 3.4.0.CR1

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * Home object for domain model class Hqserver.
 * @see org.itri.ccma.vsp.datalayer.Hqserver
 * @author Hibernate Tools
 */
@Stateless
public class HqserverHome {

	private static final Log log = LogFactory.getLog(HqserverHome.class);

	@PersistenceContext
	private EntityManager entityManager;

	public void persist(Hqserver transientInstance) {
		log.debug("persisting Hqserver instance");
		try {
			entityManager.persist(transientInstance);
			log.debug("persist successful");
		} catch (RuntimeException re) {
			log.error("persist failed", re);
			throw re;
		}
	}

	public void remove(Hqserver persistentInstance) {
		log.debug("removing Hqserver instance");
		try {
			entityManager.remove(persistentInstance);
			log.debug("remove successful");
		} catch (RuntimeException re) {
			log.error("remove failed", re);
			throw re;
		}
	}

	public Hqserver merge(Hqserver detachedInstance) {
		log.debug("merging Hqserver instance");
		try {
			Hqserver result = entityManager.merge(detachedInstance);
			log.debug("merge successful");
			return result;
		} catch (RuntimeException re) {
			log.error("merge failed", re);
			throw re;
		}
	}

	public Hqserver findById(long id) {
		log.debug("getting Hqserver instance with id: " + id);
		try {
			Hqserver instance = entityManager.find(Hqserver.class, id);
			log.debug("get successful");
			return instance;
		} catch (RuntimeException re) {
			log.error("get failed", re);
			throw re;
		}
	}
}
