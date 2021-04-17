import * as AppActions from './app';
import * as ImagesActions from './images';
import * as UsersActions from './users';
import * as CommentsActions from './comments';

export const ActionCreators = Object.assign({},
	AppActions,
	ImagesActions,
	UsersActions,
	CommentsActions
);
