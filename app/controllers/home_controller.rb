class HomeController < ApplicationController
  def index
    if user_signed_in?
      @users=User.all
      render layout:"chat"
    else
      authenticate_user!
    end
  end

  def get_room
    if params[:ajax_handler] == 'get_room'
      if params[:room].blank?
        @room=Room.get_room_by_users([current_user.id,params[:user].to_i])
        render
      else
        @room=Room.find(params[:room].to_i)
        render
      end
    end
  end

  def get_chat
    if params[:ajax_handler] == 'get_chat'
      Chat.create(content:params[:content],user_id:params[:user_id],room_id:params[:room_id])
      head :no_content
    end
  end

  def update_left
  end

end
