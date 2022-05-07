import moment from "moment";
import { Bridge } from "./bridgestuff/Bridge";
import { DittoMessage } from "./DittoMessage";

type Direction = "d2t" | "t2d";

/** Handles mapping between message IDs in discord and telegram, for message editing purposes */
export class MessageMap {
	private _map: Map<Bridge, any>;

	constructor() {
		/** The map itself */
		this._map = new Map();
	}

	/**
	 * Inserts a mapping into the map
	 *
	 * @param direction One of the two direction constants of this class
	 * @param bridge The bridge this mapping is for
	 * @param fromId Message ID to map from, i.e. the ID of the message the bot received
	 * @param toId	Message ID to map to, i.e. the ID of the message the bot sent
	 */
	insert(direction: Direction, bridge: Bridge, fromId: string, toId: string, message: string | null) {
		// Get/create the entry for the bridge
		let keyToDittoMessageMap = this._map.get(bridge);
		if (keyToDittoMessageMap === undefined) {
			keyToDittoMessageMap = new Map();
			this._map.set(bridge, keyToDittoMessageMap);
		}

		// Generate the key and get the corresponding Messages
		const key = `${direction} ${fromId}`;
		const reverseKey = direction === 'd2t' ? `t2d ${toId}` : `d2t ${toId}`;

		let dittoMessageForKey = keyToDittoMessageMap.get(key);
		if (dittoMessageForKey === undefined) {
			dittoMessageForKey = new DittoMessage(key,direction,fromId,toId,message);
			keyToDittoMessageMap.set(key, dittoMessageForKey);

			// Create the opposite direction mapping
			keyToDittoMessageMap.set(reverseKey, dittoMessageForKey);
		}

		// Start a timeout removing it again after 24 hours
		setTimeout(() => {
			keyToDittoMessageMap.delete(key);
			keyToDittoMessageMap.delete(reverseKey);
		}, moment.duration(24, "hours").asMilliseconds());
	}

	/**
	 * Gets the ID of a message the bot sent based on the ID of the message the bot received
	 *
	 * @param direction One of the two direction constants of this class
	 * @param bridge The bridge this mapping is for
	 * @param fromId Message ID to get corresponding ID for, i.e. the ID of the message the bot received the message
	 *
	 * @returns Message IDs of the corresponding message, i.e. the IDs of the messages the bot sent
	 */
	getCorresponding(direction: Direction, bridge: Bridge, fromId: string) {
		try {
			// Get the key-to-IDs map
			const keyToDittoMessageMap = this._map.get(bridge);

			// Create the key
			const key = `${direction} ${fromId}`;

			// Extract the IDs
			const DittoMessage = keyToDittoMessageMap.get(key);

			// Return the ID
			return DittoMessage;
		} catch (err) {
			// Unknown message ID. Don't do anything
			return [];
		}
	}

/*
	getCorrespondingReverse(_direction: string, bridge: Bridge, toId: string) {
		// The ID to return
		let fromId = [];

		// Get the mappings for this bridge
		const keyToIdsMap = this._map.get(bridge);
		if (keyToIdsMap !== undefined) {
			// Find the ID
			const [key] = [...keyToIdsMap].find(([, ids]) => ids.has(toId));
			fromId = key.split(" ");
			fromId.shift();
		}

		return fromId;
	}
*/

	/** Constant indicating direction discord to telegram */
	static get DISCORD_TO_TELEGRAM(): "d2t" {
		return "d2t";
	}

	/** Constant indicating direction telegram to discord */
	static get TELEGRAM_TO_DISCORD(): "t2d" {
		return "t2d";
	}
}

