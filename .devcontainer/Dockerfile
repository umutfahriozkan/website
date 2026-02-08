FROM archlinux:base

RUN pacman -Syu --noconfirm base base-devel sudo git less nano && \
    pacman -Scc --noconfirm && \
    useradd -s /bin/bash -mG wheel codespace && \
    echo 'codespace ALL=(ALL) NOPASSWD:ALL' > /etc/sudoers.d/codespace && \
    chmod 0440 /etc/sudoers.d/codespace && \
    git config --global user.name "${GIT_COMMITTER_NAME}" && \
    git config --global user.email "${GIT_COMMITTER_EMAIL}" && \
    curl -L https://raw.githubusercontent.com/devcontainers/features/refs/heads/main/src/common-utils/scripts/bash_theme_snippet.sh >> /home/codespace/.bashrc && \
    mkdir -p /home/codespace/.local && \
    git clone https://aur.archlinux.org/yay-bin.git /home/codespace/.yay && \
    chown -R codespace /home/codespace && \
    su - codespace -c "cd /home/codespace/.yay && makepkg -si --noconfirm && yay --noconfirm -S python2-bin"

ENV PATH="/home/codespace/.local/bin:$PATH"
ENV npm_config_prefix="/home/codespace/.local"