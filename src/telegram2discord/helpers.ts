import R from "ramda";
import { MessageMap } from "../MessageMap";

/**
 * Ignores errors arising from trying to delete an already deleted message. Rethrows other errors
 *
 * @param err The error to check
 *
 * @throws The error, if it is another type
 */
export const ignoreAlreadyDeletedError = R.ifElse(
	R.propEq("description", "Bad Request: message to delete not found"),
	R.always(undefined),
	err => {
		throw err;
	}
);

/**
 * Deletes a Telegram message
 *
 * @param ctx The Telegraf context to use
 * @param message The message to delete
 *
 * @returns Promise resolving when the message is deleted
 */
export const deleteMessage = R.curry((ctx, { chat, message_id }) => ctx.telegram.deleteMessage(chat.id, message_id));

/**
 * Upin a Telegram message
 *
 * @param ctx The Telegraf context to use
 * @param message The message to delete
 *
 * @returns Promise resolving when the message is deleted
 */
 export const unpinMessage = R.curry((ctx, { chat, message_id }) => ctx.telegram.deleteMessage(chat.id, message_id));


/**
 * Updates all existing Telegram messages
 * This currently is broken and limited by the Telegraf API. There is no way to fetch existing Telegram messages by messageId, so will need to either use a different package or wait until support is provided.
 *
 * @param ctx The Telegraf context to use
 *
 * @returns Promise resolving when the messages are deleted or unpinned
 */
export const updateMessages = R.curry(async (tgBot) => {
	const messageMap = tgBot.context.TediCross.messageMap;
	let promisedTasks: Promise<any>[] = new Array();
	R.forEach((bridge: any) => {
		R.forEach((dittoMessage: any) => {
			console.log(dittoMessage);
			if (!dittoMessage || dittoMessage.direction == messageMap.DIRECTION_DISCORD_TO_TELEGRAM) {
				return;
			}
			const telegramMessageId = dittoMessage.telegramMessageId;

			// Check pinned messages to make sure they are still pinned, or else unpin
			if (dittoMessage.pinned && !tgBot.telegram.Message(telegramMessageId).pinned_message) {}

			// Check non-deleted messages to make sure they still exist, or else delete
			if (!dittoMessage.deleted && !tgBot.telegram.MessageId(telegramMessageId)) {}
		})(messageMap.getDittoMessageMapForBridge(bridge))
	})(tgBot.context.TediCross.bridgeMap.bridges);

	await Promise.all(promisedTasks);
});
