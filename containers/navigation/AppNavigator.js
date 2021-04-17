import { StackNavigator } from 'react-navigation';
import Home from '../../views/Home';
import ImageEditor from '../../views/ImageEditor';
import MapContainer from '../../views/MapContainer';
import CommentContainer from '../../views/CommentContainer';
import CommentViewer from '../../views/CommentViewer';

const navigatorConfiguration = {
	headerMode: 'none'
};

const AppNavigator = StackNavigator({
	Home: {
		screen: Home
	},
	ImageEditor: {
		screen: ImageEditor,
		path: 'imageEditor/:imageData'
	},
	MapContainer: {
		screen: MapContainer,
		path: 'mapContainer/:markers'
	},
	CommentContainer: {
		screen: CommentContainer,
		path: 'commentContainer/:imageData'
	},
	CommentViewer: {
		screen: CommentViewer,
		path: 'CommentViewer/:imageData'
	},
}, navigatorConfiguration);

export default AppNavigator;
