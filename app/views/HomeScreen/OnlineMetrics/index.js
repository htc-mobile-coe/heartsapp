import React from 'react';
import { operations } from '../../../state';
import { connect } from 'react-redux';
import OnlineMetrics from './OnlineMetrics';

export class OnlineMetricsContainer extends React.Component {
    render() {
        return <OnlineMetrics {...this.props} />;
    }
}

export const mapStateToProps = state =>
    operations.preceptorDashboard.getOnlineMetrics(state);

export default connect(mapStateToProps)(OnlineMetricsContainer);
