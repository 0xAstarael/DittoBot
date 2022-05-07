import moment from "moment";
import { Bridge } from "./bridgestuff/Bridge";

type Direction = "d2t" | "t2d";

/** Message object to store cross-platform metadata */
export class Message {
    private _direction: string;
	private _discordMessageId: string;
    private _telegramMessageId: string;
    private _messageId: string;

    private _message: string;

    private _pinned: boolean;
    private _reactions: Set<string>;

    /**
	 * Creates a new Message object
	 *
     * @param messageId ID of the original message (`direction {discord|telegram}MessageId`)
	 * @param direction One of the two direction constants of this class
	 * @param discordMessageId Message ID in Discord
	 * @param telegramMessageId	Message ID in Telegram
     * @param message displayed content of message
	 */
	constructor(messageId: string, direction: Direction, discordMessageId: string, telegramMessageId: string, message: string | null) {
		/** The message itself */
		this._reactions = new Set();
        this._pinned = false;

        this._direction = direction;
        this._discordMessageId = discordMessageId;
        this._telegramMessageId = telegramMessageId;
        this._messageId = messageId;

        this._message = message;
	}
}

