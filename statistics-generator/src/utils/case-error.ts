import { _Promise } from 'error-typed-promise';

export const caseError = <ExpectedError, ResolvedResult, RejectedResult>(
    errPredicate: <E>(err: E | ExpectedError) => err is ExpectedError,
    errHandler: (err: ExpectedError) => _Promise<ResolvedResult, RejectedResult>
) => <CurrentError>(err: CurrentError) => {
    if (errPredicate(err)) {
        return errHandler(err);
    }
    return _Promise.reject(err as Exclude<CurrentError, ExpectedError>);
};
