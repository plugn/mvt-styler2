/* @flow */

import {DragTypes} from '../../constants/drag_types';
import {PropTypes} from '../../util/prop_types';
import React from 'react';
import plur from 'plur';
import classnames from 'classnames';
import Tooltip from 'cooltip';
import {RenameInput} from '../../shared_components/rename_input';
import _ from 'lodash';
import {DropTarget, DragSource} from 'react-dnd';
import {groupTarget, targetCollect, groupSource, sourceCollect} from './layer_utils';

var LayerGroupName = React.createClass({
	propTypes: {
		group: PropTypes.object.isRequired,
		onToggle: PropTypes.func.isRequired,
		onChangeName: PropTypes.func.isRequired,
		onClick: PropTypes.func.isRequired,
		connectDragSource: PropTypes.func.isRequired,
		connectDropTarget: PropTypes.func.isRequired,
		moveGroup: PropTypes.func.isRequired,
		dropGroup: PropTypes.func.isRequired,
		endDrag: PropTypes.func.isRequired
	},
	getInitialState() {
		return {
			renameErrorMessage: '',
			hovered: false
		};
	},
	onMouseEnter() {
		this.setState({hovered: true});
	},
	onMouseLeave() {
		this.setState({hovered: false});
	},
	toggleChildren() {
		this.props.onToggle(this.props.group.get('id'));
	},
	isValidName(value: any) {
		if (value.trim() === '') {
			this.setState({renameErrorMessage: 'Style name cannot be blank'});
		} else {
			this.setState({renameErrorMessage: ''});
		}
	},
	onCommitName(newName) {
		this.props.onChangeName(this.props.group.get('id'), newName);
	},
	toggleGroup(e: Event) {
		this.props.onClick(this.props.group, e);
	},
	render(): ?React.Element<any> {
		const collapsed = this.props.group.get('collapsed');
		const allActive = this.props.group.get('allActive');
		const anyActive = this.props.group.get('anyActive');
		const allHidden = this.props.group.get('allHidden');
		const layers = this.props.group.get('layers');
		const inputIconClasses = classnames({
			'pin-topright animate icon': true,
			'pencil': this.state.hovered
		});
		const inputLabelClasses = classnames({
			'truncate layer-folder-title': true,
			'space-right2': this.state.hovered
		});
		const inputContainerStyle: Object = {
			paddingLeft: 27
		};
		if (this.state.hovered) inputContainerStyle.paddingRight = 20;
		var view = (
			<div
				className={`animate ${(allActive || (anyActive && collapsed)) && 'fill-dark'} ${(allHidden) ? 'dim layer-hidden' : ''} draggable layer-group`}
				onMouseEnter={this.onMouseEnter}
				onMouseLeave={this.onMouseLeave}
			>
				{this.props.group.get('nextDropPoint') ?
					<div key={this.props.group.getIn(['layers', 0, 'id']) + '-group-drop'}
						 className='keyline-bottom keyline-stroke keyline-purple col12'/> : null}
				<Tooltip
					align='top'
					yOffset={-5}
					content={`${collapsed ? 'Expand' : 'Collapse'} group`}>
					<a className={`pin-topleft z1 icon ${collapsed ? 'caret-right' : 'caret-down'} pad00y`}
					   onClick={this.toggleChildren}/>
				</Tooltip>
				<div title={this.props.group.get('name')}
					 className='keyline-bottom keyline-dark2 layer-folder block pad0x pad00y pointer micro'
					 onClick={this.toggleGroup}>
	<span
		className='pin-topleft z1 icon inline folder'
		style={{left: 12, top: 2}}
	/>
					<div
						className='pad0x micro'
						style={inputContainerStyle}
					>
						<RenameInput
							labelName={this.props.group.get('name')}
							onConfirm={this.onCommitName}
							isValidName={this.isValidName}
							labelClassName={inputLabelClasses}
							restrictEditToIcon={true}
							labelContent={`${layers.size} ${plur('layer', layers.size)}`}
							confirmIconClassName='pin-right icon check space-right0'
							iconClassName={inputIconClasses}
							inputClassName='truncate space-right1 micro col12 round shortest clean'
							errorIconClassName='pin-right fill-orange icon alert quiet round-right'
							errorMessage={this.state.renameErrorMessage}/>
					</div>

					<span key='drag'
						  className='pin-topright z1 drag-handle animate'/>
				</div>
				{allHidden &&
				<div className='animate layer-hidden-icon pin-right space-right0 pad00y icon noevents dim noeye'/>}
			</div>
		);
		return this.props.connectDragSource(this.props.connectDropTarget(view));
	}
});

LayerGroupName = _.flow(
	DragSource(DragTypes.GROUP, groupSource, sourceCollect),
	DropTarget([DragTypes.LAYER, DragTypes.GROUP], groupTarget, targetCollect)
)(LayerGroupName);

export {LayerGroupName};

module.exports.raw = LayerGroupName;
