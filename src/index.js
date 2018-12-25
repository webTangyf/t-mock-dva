import dva from 'dva';
import './style/app.base.scss';

// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/project').default);
app.model(require('./models/projectInterface').default);
app.model(require('./models/rule').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
