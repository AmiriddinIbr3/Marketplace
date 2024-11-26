package service

import (
	"context"
	"golang-phone-microservice/services/common/genproto/phone"

	"github.com/ttacon/libphonenumber"
)

type PhoneService struct{}

func NewPhoneService() *PhoneService {
	return &PhoneService{}
}

func (s *PhoneService) CheckPhone(ctx context.Context, req *phone.ValidPhoneByNumber) (*phone.ValidatedPhone, error) {
	number := req.PhoneNumber

	isValid, countryCode, err := checkPhoneNumber(number)
	if err != nil {
		return nil, err
	}

	return &phone.ValidatedPhone{
		PhoneNumber: number,
		Valid:       isValid,
		CountryCode: countryCode,
	}, nil
}

func checkPhoneNumber(number string) (bool, string, error) {
	parsedNumber, err := libphonenumber.Parse(number, "")
	if err != nil {
		return false, "", err
	}

	isValid := libphonenumber.IsValidNumber(parsedNumber)
	countryCode := libphonenumber.GetRegionCodeForNumber(parsedNumber)

	return isValid, countryCode, nil
}
