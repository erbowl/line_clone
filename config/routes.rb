Rails.application.routes.draw do
  root "home#index"
  post "get_room",to:"home#get_room"
  post "get_chat",to:"home#get_chat"



  devise_for :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
