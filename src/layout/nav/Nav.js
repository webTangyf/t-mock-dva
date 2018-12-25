import React from 'react';
import { connect } from 'dva';
import './Nav.scss'
import styles from './Nav.scss';
import { Route } from 'dva/router';
import HomePage from '../../routes/home/Home';
import DetailPage from '../../routes/detail/Detail';

const NavLayout = ({match}) => {
  return (

  	<div className={styles.navLayout}>
  		<nav className={styles.nav + ' minW'}>
  			<div className={styles.content}>
  				<i className="iconfont icon-t"></i>
  				<span>mock</span>
  			</div>
  		</nav>
  		<div className="minW">
	  		<Route path={`${match.url}`} exact component={HomePage}></Route>
	  		<Route path={`${match.url}detail/:id/:name`} exact component={DetailPage}></Route>
  		</div>
  	</div>
  );
}

NavLayout.propTypes = {
};

export default connect()(NavLayout);
