/* @flow */

import { PropTypes } from '../util/prop_types';
import React from 'react';
import Tooltip from 'cooltip';
import Submittable from 'react-submittable';

var RenameInput = React.createClass({
	propTypes: {
		labelContent: PropTypes.any,
		inputClassName: PropTypes.string.isRequired,
		labelClassName: PropTypes.string.isRequired,
		confirmIconClassName: PropTypes.string.isRequired,
		errorIconClassName: PropTypes.string.isRequired,
		iconClassName: PropTypes.string.isRequired,
		labelName: PropTypes.string.isRequired,
		isValidName: PropTypes.func.isRequired,
		errorMessage: PropTypes.string.isRequired,
		onConfirm: PropTypes.func.isRequired,
		restrictEditToIcon: PropTypes.bool.isRequired,
		labelTest: PropTypes.string.isRequired,
		confirmTest: PropTypes.string.isRequired,
		triggerTest: PropTypes.string
	},
	getDefaultProps() {
		return {
			iconClassName: 'a pin-right pad0y icon pencil show-in-hover animate',
			confirmIconClassName: 'a pad0y pin-right icon check space-right0',
			labelClassName: 'small pad0y truncate space-right2 strong',
			inputClassName: 'truncate clean small short col12 space-right2 round',
			errorIconClassName: 'pin-right pad0y fill-orange icon alert quiet round-right',
			errorMessage: '',
			restrictEditToIcon: false,
			labelTest: '',
			confirmTest: ''
		};
	},
	getInitialState() {
		return {
			renameMode: false,
			newName: ''
		};
	},
	onChange(e: EventWithTarget) {
		if (e.target && e.target.value !== undefined) {
			this.setState({ newName: e.target.value
			}, () => this.props.isValidName(this.state.newName));
		}
	},
	onCancel() {
		this.setState({ renameMode: false });
	},
	onConfirm() {
		if (this.props.errorMessage !== '') {
			this.setState({ renameMode: false });
			this.props.onConfirm(this.props.labelName);
		} else {
			this.props.onConfirm(this.state.newName);
			this.setState({ renameMode: false });
		}
	},
	toggleRenameMode(e: Object) {
		e.stopPropagation();
		this.setState({
			renameMode: !this.state.renameMode,
			newName: this.props.labelName
		}, () => {
			if (this.state.renameMode) {
				this.refs.renameInput.select();
			}
		});
	},
	suppressClick(e: Object) {
		e.stopPropagation();
	},
	render(): ?React.Element<any> {
		return (
			<div className={`contain col12 ${!this.state.renameMode && !this.props.restrictEditToIcon ? 'pointer' : ''}`}
				 onClick={this.state.renameMode && this.suppressClick}>
				{this.state.renameMode ? <Submittable onEnter={this.onConfirm} className='' onCancel={this.onCancel}>
						{this.props.errorMessage && this.props.errorMessage !== '' ?
							<Tooltip
								align='top'
								yOffset={-12}
								content={this.props.errorMessage}>
								<div className={this.props.errorIconClassName} />
							</Tooltip> :
							<button
								data-test={this.props.confirmTest}
								onClick={this.onConfirm}
								className={`${this.props.confirmIconClassName}`}/>}
						<input
							style={{ paddingRight: 20 }}
							ref='renameInput'
							type='text'
							autoFocus={true}
							value={this.state.newName}
							onChange={this.onChange}
							onBlur={this.onConfirm}
							className={`${this.props.inputClassName} ${(this.props.errorMessage !== '') ? 'has-error' : ''}`}
						/>
					</Submittable> :
					<div className={this.props.labelClassName} onClick={!this.props.restrictEditToIcon && this.toggleRenameMode}>
						<span data-test={this.props.labelTest}>{this.props.labelName}</span>
						{this.props.labelContent && <span className='quiet space-left0'>{this.props.labelContent}</span>}
						<button onClick={this.toggleRenameMode} data-test={this.props.triggerTest} className={`${this.props.iconClassName}`} />
					</div>
				}
			</div>
		);
	}
});

export { RenameInput };
