import * as dateFns from 'date-fns'
import { useDateAdapter } from '../date';

import {
  dateAfter,
  dateAfterToday,
  dateBefore,
  dateBeforeToday,
  dateFormat,
  dateISO,
} from './date.rule';

import { DateFnsAdapter } from '../date/date-fns.adapter';

const adapter = new DateFnsAdapter(dateFns);
useDateAdapter(adapter);

test("rules:dateAfter", function (): void {
  const ruleHandler = dateAfter([DateFnsAdapter.FORMAT_yyyy_MM_dd, "2020-05-20"]).handler;
  expect(ruleHandler("2020-06-20")).toBe(true);
  expect(ruleHandler("2020-04-20")).toBe(false);
});

test("rules:dateAfterToday", function (): void {
  const ruleHandler = dateAfterToday([
    DateFnsAdapter.FORMAT_yyyy_MM_dd,
  ]).handler;

  const dateafterToday = adapter.format(adapter.addDays(new Date, 1), DateFnsAdapter.FORMAT_yyyy_MM_dd);
  const dateToday = adapter.format(new Date, DateFnsAdapter.FORMAT_yyyy_MM_dd);

  expect(ruleHandler(dateafterToday)).toBe(true);
  expect(ruleHandler(dateToday)).toBe(false);
});

test("rules:dateBefore", function (): void {
  const dateToday = adapter.format(new Date, DateFnsAdapter.FORMAT_yyyy_MM_dd);

  const ruleHandler = dateBefore([DateFnsAdapter.FORMAT_yyyy_MM_dd, dateToday]).handler;

  const datebeforeToday = adapter.format(adapter.subDays(new Date, 1), DateFnsAdapter.FORMAT_yyyy_MM_dd);
  const dateafterToday = adapter.format(adapter.addDays(new Date, 1), DateFnsAdapter.FORMAT_yyyy_MM_dd);

  expect(ruleHandler(dateafterToday)).toBe(false);
  expect(ruleHandler(datebeforeToday)).toBe(true);
});

test("rules:dateBeforeToday", function (): void {
  const ruleHandler = dateBeforeToday([
    DateFnsAdapter.FORMAT_yyyy_MM_dd,
  ]).handler;

  const datebeforeToday = adapter.format(adapter.subDays(new Date, 1), DateFnsAdapter.FORMAT_yyyy_MM_dd);
  const dateToday = adapter.format(new Date, DateFnsAdapter.FORMAT_yyyy_MM_dd);

  expect(ruleHandler(datebeforeToday)).toBe(true);
  expect(ruleHandler(dateToday)).toBe(false);
});

test("rules:dateFormat", (): void => {
  const ruleHandler = dateFormat([DateFnsAdapter.FORMAT_yyyy_MM_dd]).handler;
  expect(ruleHandler("2019-12-24")).toBe(true);
  expect(ruleHandler("2021-13-25")).toBe(false);
});

test("rules:dateISO", function (): void {
  const ruleHandler = dateISO().handler;
  expect(ruleHandler("2019-07-01T10:10:00")).toBe(true);
  expect(ruleHandler("2019-07-01T10:10:00.00Z")).toBe(true);
  expect(ruleHandler("01/26/2018")).toBe(false);
  expect(ruleHandler("12 12 18")).toBe(false);
});
