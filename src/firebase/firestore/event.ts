import {EventEmitter} from "events"


export type OnSizeListener = (size: string) => void

export type OnStepListener = (message: string, count: number, size: number) => void


export class ProgressEvent {
  private readonly EVENT_SIZE = "EVENT_SIZE"
  private readonly EVENT_STEP = "EVENT_STEP"

  private _emitter = new EventEmitter()
  private _count: number = 0
  private _size: number = 0

  public emitSize(size: number) {
    this._size += size
    this._emitter.emit(this.EVENT_SIZE, this._size)
  }

  public emitStep(message: string) {
    this._count += 1
    this._emitter.emit(this.EVENT_STEP, this._count, this._size)
  }

  public onSize(listener: OnSizeListener) {
    this._emitter.addListener(this.EVENT_SIZE, listener)
  }

  public onStep(listener: OnStepListener) {
    this._emitter.addListener(this.EVENT_STEP, listener)
  }

  public removeAllListeners() {
    this._emitter.removeAllListeners()
  }

  public removeOnSizeListener(listener: OnSizeListener) {
    this._emitter.removeListener(this.EVENT_SIZE, listener)
  }

  public removeOnStepListener(listener: OnStepListener) {
    this._emitter.removeListener(this.EVENT_STEP, listener)
  }
}
