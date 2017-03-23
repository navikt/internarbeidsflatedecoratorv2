import { connect } from 'react-redux';
import Sokefelt from '../components/Sokefelt';
import * as feilmeldingerActions from '../actions/feilmeldinger_actions';


export default connect(null, { ...feilmeldingerActions })(Sokefelt);
